use std::env;
use std::net::{TcpStream, ToSocketAddrs};
use std::path::Path;
use std::time::Duration;

const LOCALHOST: &str = "127.0.0.1";
const DEFAULT_PORT: u16 = 5225;
const SECURITY_BOUNDARY: &str =
    "SimpleX CLI WebSocket is unauthenticated; Freexster only probes 127.0.0.1.";

#[derive(Debug, Clone)]
pub struct SimplexRunnerConfig {
    pub binary_path: Option<String>,
    pub port: u16,
}

impl SimplexRunnerConfig {
    pub fn from_env() -> Self {
        Self::from_env_values(
            env::var("FREEXSTER_SIMPLEX_CHAT_PATH").ok(),
            env::var("FREEXSTER_SIMPLEX_CHAT_PORT").ok(),
        )
    }

    pub fn from_env_values(binary_path: Option<String>, port: Option<String>) -> Self {
        Self {
            binary_path: binary_path.and_then(normalize_binary_path),
            port: parse_port(port),
        }
    }
}

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SimplexRunnerStatus {
    pub runtime: &'static str,
    pub host: &'static str,
    pub port: u16,
    pub web_socket_url: String,
    pub state: &'static str,
    pub configured: bool,
    pub can_connect: bool,
    pub binary_path: Option<String>,
    pub last_error: Option<String>,
    pub security_boundary: &'static str,
}

pub fn status_from_config<F>(config: SimplexRunnerConfig, connector: F) -> SimplexRunnerStatus
where
    F: Fn(&str, u16) -> bool,
{
    let can_connect = connector(LOCALHOST, config.port);
    let configured = config.binary_path.is_some();
    let binary_missing = config
        .binary_path
        .as_deref()
        .is_some_and(configured_filesystem_path_is_missing);

    let (state, last_error) = if can_connect {
        ("listening", None)
    } else if binary_missing {
        (
            "missing-binary",
            Some("FREEXSTER_SIMPLEX_CHAT_PATH points to a file that does not exist.".to_string()),
        )
    } else if configured {
        ("configured-not-running", None)
    } else {
        ("not-configured", None)
    };

    SimplexRunnerStatus {
        runtime: "tauri",
        host: LOCALHOST,
        port: config.port,
        web_socket_url: format!("ws://{LOCALHOST}:{}", config.port),
        state,
        configured,
        can_connect,
        binary_path: config.binary_path,
        last_error,
        security_boundary: SECURITY_BOUNDARY,
    }
}

#[tauri::command]
pub fn simplex_runner_status() -> SimplexRunnerStatus {
    status_from_config(SimplexRunnerConfig::from_env(), can_connect_localhost)
}

fn normalize_binary_path(path: String) -> Option<String> {
    let trimmed = path.trim();

    if trimmed.is_empty() {
        None
    } else {
        Some(trimmed.to_string())
    }
}

fn parse_port(port: Option<String>) -> u16 {
    port.and_then(|value| value.trim().parse::<u16>().ok())
        .filter(|port| *port > 0)
        .unwrap_or(DEFAULT_PORT)
}

fn configured_filesystem_path_is_missing(path: &str) -> bool {
    let looks_like_path = Path::new(path).is_absolute() || path.contains('\\') || path.contains('/');

    looks_like_path && !Path::new(path).exists()
}

fn can_connect_localhost(host: &str, port: u16) -> bool {
    let Ok(mut addresses) = (host, port).to_socket_addrs() else {
        return false;
    };
    let Some(address) = addresses.next() else {
        return false;
    };

    TcpStream::connect_timeout(&address, Duration::from_millis(150)).is_ok()
}
