use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

// Data structures
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Customer {
    pub id: String,
    pub name: String,
    #[serde(rename = "engagementType")]
    pub engagement_type: String,
    #[serde(rename = "initialHours")]
    pub initial_hours: f64,
    #[serde(rename = "createdAt")]
    pub created_at: String,
    pub archived: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TimeSession {
    pub id: String,
    pub date: String,
    #[serde(rename = "startTime")]
    pub start_time: String,
    #[serde(rename = "endTime")]
    pub end_time: Option<String>,
    #[serde(rename = "durationSeconds")]
    pub duration_seconds: u64,
    #[serde(rename = "durationFormatted")]
    pub duration_formatted: String,
    pub notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CustomerTimeLog {
    #[serde(rename = "customerId")]
    pub customer_id: String,
    #[serde(rename = "customerName")]
    pub customer_name: String,
    #[serde(rename = "engagementType")]
    pub engagement_type: String,
    #[serde(rename = "initialHours")]
    pub initial_hours: f64,
    pub sessions: Vec<TimeSession>,
    #[serde(rename = "totalSecondsLogged")]
    pub total_seconds_logged: u64,
    #[serde(rename = "totalHoursLogged")]
    pub total_hours_logged: f64,
    #[serde(rename = "hoursRemaining")]
    pub hours_remaining: f64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AppSettings {
    pub theme: String,
    #[serde(rename = "alwaysOnTop")]
    pub always_on_top: bool,
    #[serde(rename = "compactMode")]
    pub compact_mode: bool,
    #[serde(rename = "autoStopHours")]
    pub auto_stop_hours: u32,
    #[serde(rename = "idleDetection")]
    pub idle_detection: bool,
    #[serde(rename = "idleTimeoutMinutes")]
    pub idle_timeout_minutes: u32,
}

impl Default for AppSettings {
    fn default() -> Self {
        AppSettings {
            theme: "dark".to_string(),
            always_on_top: false,
            compact_mode: false,
            auto_stop_hours: 8,
            idle_detection: false,
            idle_timeout_minutes: 240,
        }
    }
}

// Helper function to get the data directory
fn get_data_dir() -> PathBuf {
    let home = dirs::home_dir().expect("Could not find home directory");
    home.join(".local-time-tracker")
}

fn ensure_data_dir() -> Result<PathBuf, String> {
    let data_dir = get_data_dir();
    if !data_dir.exists() {
        fs::create_dir_all(&data_dir).map_err(|e| e.to_string())?;
    }
    let logs_dir = data_dir.join("logs");
    if !logs_dir.exists() {
        fs::create_dir_all(&logs_dir).map_err(|e| e.to_string())?;
    }
    Ok(data_dir)
}

// Tauri commands

#[tauri::command]
fn get_customers() -> Result<Vec<Customer>, String> {
    let data_dir = ensure_data_dir()?;
    let customers_file = data_dir.join("customers.json");
    
    if !customers_file.exists() {
        return Ok(vec![]);
    }
    
    let data = fs::read_to_string(&customers_file).map_err(|e| e.to_string())?;
    let customers: Vec<Customer> = serde_json::from_str(&data).map_err(|e| e.to_string())?;
    Ok(customers)
}

#[tauri::command]
fn save_customer(customer: Customer) -> Result<Customer, String> {
    let data_dir = ensure_data_dir()?;
    let customers_file = data_dir.join("customers.json");
    
    let mut customers: Vec<Customer> = if customers_file.exists() {
        let data = fs::read_to_string(&customers_file).map_err(|e| e.to_string())?;
        serde_json::from_str(&data).unwrap_or_default()
    } else {
        vec![]
    };
    
    // Check if customer already exists (update) or is new (add)
    if let Some(pos) = customers.iter().position(|c| c.id == customer.id) {
        customers[pos] = customer.clone();
    } else {
        customers.push(customer.clone());
    }
    
    let json = serde_json::to_string_pretty(&customers).map_err(|e| e.to_string())?;
    fs::write(&customers_file, json).map_err(|e| e.to_string())?;
    
    // Also create/update the customer's time log file
    let log_file = data_dir.join("logs").join(format!("{}.json", customer.id));
    if !log_file.exists() {
        let time_log = CustomerTimeLog {
            customer_id: customer.id.clone(),
            customer_name: customer.name.clone(),
            engagement_type: customer.engagement_type.clone(),
            initial_hours: customer.initial_hours,
            sessions: vec![],
            total_seconds_logged: 0,
            total_hours_logged: 0.0,
            hours_remaining: customer.initial_hours,
        };
        let log_json = serde_json::to_string_pretty(&time_log).map_err(|e| e.to_string())?;
        fs::write(&log_file, log_json).map_err(|e| e.to_string())?;
    }
    
    Ok(customer)
}

#[tauri::command]
fn delete_customer(customer_id: String) -> Result<(), String> {
    let data_dir = ensure_data_dir()?;
    let customers_file = data_dir.join("customers.json");
    
    if !customers_file.exists() {
        return Ok(());
    }
    
    let data = fs::read_to_string(&customers_file).map_err(|e| e.to_string())?;
    let mut customers: Vec<Customer> = serde_json::from_str(&data).unwrap_or_default();
    
    customers.retain(|c| c.id != customer_id);
    
    let json = serde_json::to_string_pretty(&customers).map_err(|e| e.to_string())?;
    fs::write(&customers_file, json).map_err(|e| e.to_string())?;
    
    Ok(())
}

#[tauri::command]
fn get_customer_time_log(customer_id: String) -> Result<CustomerTimeLog, String> {
    let data_dir = ensure_data_dir()?;
    let log_file = data_dir.join("logs").join(format!("{}.json", customer_id));
    
    if !log_file.exists() {
        return Err("Time log not found".to_string());
    }
    
    let data = fs::read_to_string(&log_file).map_err(|e| e.to_string())?;
    let time_log: CustomerTimeLog = serde_json::from_str(&data).map_err(|e| e.to_string())?;
    Ok(time_log)
}

#[tauri::command]
fn save_time_session(customer_id: String, session: TimeSession) -> Result<CustomerTimeLog, String> {
    let data_dir = ensure_data_dir()?;
    let log_file = data_dir.join("logs").join(format!("{}.json", customer_id));
    
    if !log_file.exists() {
        return Err("Time log not found".to_string());
    }
    
    let data = fs::read_to_string(&log_file).map_err(|e| e.to_string())?;
    let mut time_log: CustomerTimeLog = serde_json::from_str(&data).map_err(|e| e.to_string())?;
    
    // Check if session already exists (update) or is new (add)
    if let Some(pos) = time_log.sessions.iter().position(|s| s.id == session.id) {
        time_log.sessions[pos] = session;
    } else {
        time_log.sessions.push(session);
    }
    
    // Recalculate totals (round to 2 decimal places)
    time_log.total_seconds_logged = time_log.sessions.iter().map(|s| s.duration_seconds).sum();
    time_log.total_hours_logged = ((time_log.total_seconds_logged as f64 / 3600.0) * 100.0).round() / 100.0;
    time_log.hours_remaining = ((time_log.initial_hours - time_log.total_hours_logged) * 100.0).round() / 100.0;
    
    let json = serde_json::to_string_pretty(&time_log).map_err(|e| e.to_string())?;
    fs::write(&log_file, json).map_err(|e| e.to_string())?;
    
    Ok(time_log)
}

#[tauri::command]
fn get_settings() -> Result<AppSettings, String> {
    let data_dir = ensure_data_dir()?;
    let settings_file = data_dir.join("settings.json");
    
    if !settings_file.exists() {
        return Ok(AppSettings::default());
    }
    
    let data = fs::read_to_string(&settings_file).map_err(|e| e.to_string())?;
    let settings: AppSettings = serde_json::from_str(&data).map_err(|e| e.to_string())?;
    Ok(settings)
}

#[tauri::command]
fn save_settings(settings: AppSettings) -> Result<(), String> {
    let data_dir = ensure_data_dir()?;
    let settings_file = data_dir.join("settings.json");
    
    let json = serde_json::to_string_pretty(&settings).map_err(|e| e.to_string())?;
    fs::write(&settings_file, json).map_err(|e| e.to_string())?;
    
    Ok(())
}

#[tauri::command]
fn get_data_path() -> Result<String, String> {
    let data_dir = ensure_data_dir()?;
    Ok(data_dir.to_string_lossy().to_string())
}

#[tauri::command]
fn export_csv(file_path: String, content: String) -> Result<(), String> {
    fs::write(&file_path, content).map_err(|e| e.to_string())?;
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            get_customers,
            save_customer,
            delete_customer,
            get_customer_time_log,
            save_time_session,
            get_settings,
            save_settings,
            get_data_path,
            export_csv
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
