import { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import Toast from "../../Componet/Teost";

export default function Settings() {
  const { user } = useAuth();
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    theme: "light",
    notifications: {
      email: true,
      messages: true,
      updates: false,
    },
    language: "en",
    timezone: "Africa/Addis_Ababa",
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('admin_settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Error loading settings:', e);
      }
    }
  }, []);

  const handleToggle = (section, key) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [key]: !settings[section][key],
      },
    });
  };

  const handleThemeChange = (theme) => {
    setSettings({ ...settings, theme });
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };

  const handleSave = () => {
    setLoading(true);
    try {
      localStorage.setItem('admin_settings', JSON.stringify(settings));
      showToast("✅ Settings saved successfully!", "success");
    } catch (error) {
      showToast("❌ Failed to save settings", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-primary">Settings</h2>
        <p className="text-muted text-sm">Customize your admin experience</p>
      </div>

      <div className="space-y-4">
        {/* Appearance */}
        <div className="bg-card border border-theme rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: "var(--color-primary)08" }}>
              🎨
            </div>
            <div>
              <h3 className="font-bold text-primary">Appearance</h3>
              <p className="text-[10px] text-muted">Choose your preferred theme</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleThemeChange("light")}
              className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                settings.theme === "light" ? "border-secondary" : "border-theme"
              }`}
              style={{
                background: settings.theme === "light" ? "var(--nav-active-bg)" : "var(--card-bg)",
              }}
            >
              <div className="text-2xl mb-1">☀️</div>
              <div className="text-sm font-semibold text-primary">Light</div>
              {settings.theme === "light" && (
                <div className="mt-1 flex justify-center">
                  <div className="w-6 h-0.5 rounded-full bg-secondary" />
                </div>
              )}
            </button>
            <button
              onClick={() => handleThemeChange("dark")}
              className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                settings.theme === "dark" ? "border-secondary" : "border-theme"
              }`}
              style={{
                background: settings.theme === "dark" ? "var(--nav-active-bg)" : "var(--card-bg)",
              }}
            >
              <div className="text-2xl mb-1">🌙</div>
              <div className="text-sm font-semibold text-primary">Dark</div>
              {settings.theme === "dark" && (
                <div className="mt-1 flex justify-center">
                  <div className="w-6 h-0.5 rounded-full bg-secondary" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card border border-theme rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: "var(--color-secondary)08" }}>
              🔔
            </div>
            <div>
              <h3 className="font-bold text-primary">Notifications</h3>
              <p className="text-[10px] text-muted">Manage your notification preferences</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl border border-theme">
              <div>
                <div className="text-sm font-semibold text-primary">Email Notifications</div>
                <div className="text-[10px] text-muted">Receive updates via email</div>
              </div>
              <button
                onClick={() => handleToggle('notifications', 'email')}
                className={`w-12 h-6 rounded-full transition-all ${settings.notifications.email ? 'bg-secondary' : 'bg-theme-light'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-all ${settings.notifications.email ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-theme">
              <div>
                <div className="text-sm font-semibold text-primary">Message Alerts</div>
                <div className="text-[10px] text-muted">Get notified about new messages</div>
              </div>
              <button
                onClick={() => handleToggle('notifications', 'messages')}
                className={`w-12 h-6 rounded-full transition-all ${settings.notifications.messages ? 'bg-secondary' : 'bg-theme-light'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-all ${settings.notifications.messages ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-theme">
              <div>
                <div className="text-sm font-semibold text-primary">System Updates</div>
                <div className="text-[10px] text-muted">Receive system maintenance notifications</div>
              </div>
              <button
                onClick={() => handleToggle('notifications', 'updates')}
                className={`w-12 h-6 rounded-full transition-all ${settings.notifications.updates ? 'bg-secondary' : 'bg-theme-light'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-all ${settings.notifications.updates ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-card border border-theme rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: "var(--color-primary)08" }}>
              ⚙️
            </div>
            <div>
              <h3 className="font-bold text-primary">Preferences</h3>
              <p className="text-[10px] text-muted">Language and region settings</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted mb-1.5 block">Language</label>
              <select
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none select-theme"
              >
                <option value="en">🇬🇧 English</option>
                <option value="am">🇪🇹 Amharic</option>
                <option value="fr">🇫🇷 French</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted mb-1.5 block">Time Zone</label>
              <select
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none select-theme"
              >
                <option value="Africa/Addis_Ababa">🇪🇹 Addis Ababa (UTC+3)</option>
                <option value="Africa/Nairobi">🇰🇪 Nairobi (UTC+3)</option>
                <option value="Africa/Cairo">🇪🇬 Cairo (UTC+2)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60 btn-primary"
        >
          {loading ? "⏳ Saving..." : "💾 Save All Settings"}
        </button>
      </div>

      <style>{`
        .select-theme {
          background: var(--card-bg);
          border-color: var(--border-color);
          color: var(--text-primary);
        }
        .select-theme:focus {
          border-color: var(--color-primary);
          outline: none;
          box-shadow: 0 0 0 3px rgba(26,35,126,0.1);
        }
        .select-theme option {
          background: var(--card-bg);
          color: var(--text-primary);
        }
        .btn-primary {
          background: var(--gradient-primary);
        }
      `}</style>
    </div>
  );
}