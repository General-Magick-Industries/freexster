pub mod simplex_runner;

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
struct FreexsterNativeStatus {
    runtime: &'static str,
    simplex_runner: &'static str,
    registry: &'static str,
}

#[tauri::command]
fn freexster_status() -> FreexsterNativeStatus {
    let runner = simplex_runner::simplex_runner_status();

    FreexsterNativeStatus {
        runtime: "tauri",
        simplex_runner: runner.state,
        registry: "mock",
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            freexster_status,
            simplex_runner::simplex_runner_status
        ])
        .run(tauri::generate_context!())
        .expect("error while running Freexster");
}
