use freexster_lib::simplex_runner::{status_from_config, SimplexRunnerConfig};

#[test]
fn reports_not_configured_when_no_binary_and_port_closed() {
    let status = status_from_config(
        SimplexRunnerConfig {
            binary_path: None,
            port: 5225,
        },
        |_, _| false,
    );

    assert_eq!(status.state, "not-configured");
    assert!(!status.configured);
    assert!(!status.can_connect);
    assert_eq!(status.web_socket_url, "ws://127.0.0.1:5225");
}

#[test]
fn reports_listening_when_localhost_port_accepts_connections() {
    let status = status_from_config(
        SimplexRunnerConfig {
            binary_path: Some("simplex-chat".to_string()),
            port: 5225,
        },
        |host, port| host == "127.0.0.1" && port == 5225,
    );

    assert_eq!(status.state, "listening");
    assert!(status.configured);
    assert!(status.can_connect);
}

#[test]
fn clamps_invalid_ports_to_default() {
    let config = SimplexRunnerConfig::from_env_values(None, Some("70000".to_string()));

    assert_eq!(config.port, 5225);
}
