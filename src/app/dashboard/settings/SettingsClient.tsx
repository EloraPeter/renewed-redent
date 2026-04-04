// src/app/dashboard/settings/SettingsClient.tsx
"use client";

import { useState, useActionState, useEffect } from "react";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import {
    Moon, Sun, Bell, User, LogOut,
    Minimize2, Volume2, VolumeX,
    Shield, Clock
} from "lucide-react";
import {
    updateDisplayName,
    changePassword,
    deleteAccount,
    updateLecturerPreferences,
    exportMyData,
} from "./actions";

type UserData = {
    email: string;
    display_name: string;
    role: string;
};

type Props = {
    initialUser: UserData;
    role: string;
    latePenalty: number;
    gradingScale: Record<string, number>;
};

type ActionState<T = any> = {
    success?: string;
    error?: string;
    data?: T;
} | null;

export default function SettingsClient({ initialUser, role }: Props) {
    const [darkMode, setDarkMode] = useState(false);
    const [minimalMochi, setMinimalMochi] = useState(false);
    const [notificationStatus, setNotificationStatus] = useState<NotificationPermission>("default");
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Dark mode
    useEffect(() => {
        const savedTheme = localStorage.getItem("mochido-theme") ||
            (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

        setDarkMode(savedTheme === "dark");
        document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }, []);

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        document.documentElement.classList.toggle("dark", newMode);
        localStorage.setItem("mochido-theme", newMode ? "dark" : "light");
        toast.success(`Switched to ${newMode ? "dark" : "light"} mode`);
    };

    // Minimal Mochi
    useEffect(() => {
        const saved = localStorage.getItem("minimalMochi") === "true";
        setMinimalMochi(saved);
        document.documentElement.classList.toggle("minimal-mochi", saved);
    }, []);

    const toggleMinimalMochi = () => {
        const newVal = !minimalMochi;
        setMinimalMochi(newVal);
        localStorage.setItem("minimalMochi", String(newVal));
        document.documentElement.classList.toggle("minimal-mochi", newVal);

        toast(newVal
            ? "Mochi is now in calm mode 🐹"
            : "Full Mochi energy restored! 🎉"
        );
    };

    // Notifications
    useEffect(() => {
        if ("Notification" in window) {
            setNotificationStatus(Notification.permission);
        }
    }, []);

    const requestNotifications = async () => {
        if (!("Notification" in window)) {
            toast.error("Notifications not supported in this browser");
            return;
        }

        try {
            const permission = await Notification.requestPermission();
            setNotificationStatus(permission);

            if (permission === "granted") {
                toast.success("Notifications enabled – Mochi can now remind you!");
            } else {
                toast.error("Permission denied. Check browser settings to allow later.");
            }
        } catch (err) {
            toast.error("Something went wrong requesting permission");
        }
    };
    
    // display name action state
    const [displayNameState, displayNameAction, displayNamePending] = useActionState<ActionState>(
        updateDisplayName,
        null
    );

    useEffect(() => {
        if (displayNameState?.success) {
            toast.success(displayNameState.success);
        }
        if (displayNameState?.error) {
            toast.error(displayNameState.error);
        }
    }, [displayNameState]);

    // change password action state
    const [passwordState, passwordAction, passwordPending] = useActionState<ActionState>(
        changePassword,
        null
    );

    useEffect(() => {
        if (passwordState?.success) toast.success(passwordState.success);
        if (passwordState?.error) toast.error(passwordState.error);
    }, [passwordState]);

    //   lecturer preferences action state
    const [lecturerState, lecturerAction, lecturerPending] = useActionState<ActionState>(
        updateLecturerPreferences,
        null
    );

    useEffect(() => {
        if (lecturerState?.success) toast.success(lecturerState.success);
        if (lecturerState?.error) toast.error(lecturerState.error);
    }, [lecturerState]);

    //   export data action state
    const handleExport = async () => {
        try {
            const result = await exportMyData();
            if (result?.message) {
                toast.success(result.message);
                // For real download later:
                // const blob = new Blob([JSON.stringify(userData, null, 2)], { type: "application/json" });
                // const url = URL.createObjectURL(blob);
                // const a = document.createElement("a");
                // a.href = url; a.download = "mochido-data.json"; a.click();
            }
        } catch (err) {
            toast.error("Export failed");
        }
    };

    //   delete account action state
    const [deleteState, deleteAction, deletePending] = useActionState<ActionState>(
        deleteAccount,
        null
    );


    return (
        <div className="space-y-8">
            {/* Profile Card */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">

                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <User className="text-pink-600" size={22} />
                        Your Profile
                    </h2>
                </div>
                <div className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Display Name</label>
                        <p className="font-medium text-lg">{initialUser.display_name}</p>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Email</label>
                        <p className="font-medium">{initialUser.email}</p>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Role</label>
                        <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium capitalize">
                            {initialUser.role}
                        </span>
                    </div>
                </div>
            </section>

            {/* Edit Display Name */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold mb-4">Edit Display Name</h2>
                <form action={updateDisplayName} className="space-y-4">
                    <input
                        name="displayName"
                        defaultValue={initialUser.display_name}
                        placeholder="Your display name"
                        className="w-full p-3 border rounded-lg dark:bg-gray-700"
                        required
                        minLength={2}
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
                    >
                        Save Name
                    </button>
                </form>
            </section>

            {/* Change Password */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                <form action={changePassword} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1">Current Password</label>
                        <input
                            type="password"
                            name="oldPassword"
                            required
                            className="w-full p-3 border rounded-lg dark:bg-gray-700"
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            required
                            minLength={8}
                            className="w-full p-3 border rounded-lg dark:bg-gray-700"
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmNew"
                            required
                            className="w-full p-3 border rounded-lg dark:bg-gray-700"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                        Update Password
                    </button>
                </form>
            </section>

            {/* Lecturer-only Preferences */}
            {role === "lecturer" && (
                <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-semibold mb-4">Grading & Late Policy</h2>
                    <form action={updateLecturerPreferences} className="space-y-6">
                        <div>
                            <label className="block text-sm mb-1">Late Penalty (% per day)</label>
                            <input
                                type="number"
                                name="latePenalty"
                                defaultValue={5} // fetch real value later
                                min={0}
                                max={50}
                                className="w-full p-3 border rounded-lg dark:bg-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Grading Scale (JSON format)</label>
                            <textarea
                                name="gradingScale"
                                defaultValue={JSON.stringify({ A: 90, B: 80, C: 70, D: 60, F: 0 }, null, 2)}
                                rows={6}
                                className="w-full p-3 border rounded-lg font-mono text-sm dark:bg-gray-700"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Example: {"{ \"A\": 90, \"B\": 80, ... }"}
                            </p>
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Save Preferences
                        </button>
                    </form>
                </section>
            )}

            {/* Preferences */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold">Preferences</h2>
                </div>

                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {/* Dark Mode */}
                    <div className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {darkMode ? (
                                <Moon className="text-yellow-500" size={24} />
                            ) : (
                                <Sun className="text-amber-500" size={24} />
                            )}
                            <div>
                                <p className="font-medium">Dark Mode</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {darkMode ? "On" : "Off"}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={toggleDarkMode}
                            className="px-5 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition font-medium"
                        >
                            Toggle
                        </button>
                    </div>

                    {/* Minimal Mochi */}
                    <div className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Minimize2 className="text-blue-500" size={24} />
                            <div>
                                <p className="font-medium">Minimal Mochi Mode</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {minimalMochi
                                        ? "Calm version (good for focus / lecturers)"
                                        : "Full emotional Mochi experience"}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={toggleMinimalMochi}
                            className="px-5 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition font-medium"
                        >
                            {minimalMochi ? "Disable" : "Enable"}
                        </button>
                    </div>

                    {/* Notifications */}
                    <div className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Bell className="text-pink-600" size={24} />
                            <div>
                                <p className="font-medium">Notifications</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {notificationStatus === "granted"
                                        ? "Enabled"
                                        : notificationStatus === "denied"
                                            ? "Blocked by browser"
                                            : "Not requested yet"}
                                </p>
                            </div>
                        </div>
                        {notificationStatus !== "granted" && (
                            <button
                                onClick={requestNotifications}
                                className="px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition font-medium"
                            >
                                Enable
                            </button>
                        )}
                    </div>

                    {/* Sound (placeholder for future reminder sounds) */}
                    <div className="p-6 flex items-center justify-between opacity-60 pointer-events-none">
                        <div className="flex items-center gap-4">
                            {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                            <div>
                                <p className="font-medium">Reminder Sounds</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Coming soon</p>
                            </div>
                        </div>
                        <div className="px-5 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg font-medium">
                            {soundEnabled ? "On" : "Off"}
                        </div>
                    </div>
                </div>
            </section>

            {/* Account Actions */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-red-200 dark:border-red-900/40 overflow-hidden">
                <div className="p-6 border-b border-red-200 dark:border-red-900/40">
                    <h2 className="text-xl font-semibold text-red-700 dark:text-red-400">Account Actions</h2>
                </div>
                <div className="p-6">
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="flex items-center gap-3 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition w-full md:w-auto justify-center font-medium"
                    >
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </section>
            {/* Export Data (placeholder) */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold mb-4">Export My Data</h2>
                <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">
                    Download all your courses, assignments, submissions, and routines (coming soon).
                </p>
                <button
                    onClick={async () => {
                        const res = await exportMyData();
                        alert(res.message);
                        // Later: trigger actual JSON download
                    }}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                    Export Data (Demo)
                </button>
            </section>

            {/* Delete Account – Danger Zone */}
            <section className="bg-red-50 dark:bg-red-950/30 rounded-2xl shadow-sm border border-red-200 dark:border-red-800 p-6">
                <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-4">Delete Account</h2>
                <p className="text-sm mb-4">
                    This action is permanent. Type <strong>DELETE MY ACCOUNT</strong> to confirm.
                </p>
                <form action={deleteAccount} className="space-y-4">
                    <input
                        name="confirmation"
                        placeholder="Type DELETE MY ACCOUNT"
                        className="w-full p-3 border border-red-300 rounded-lg dark:bg-gray-800"
                        required
                    />
                    <button
                        type="submit"
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium"
                    >
                        Permanently Delete Account
                    </button>
                </form>
            </section>

            <p className="text-center text-sm text-gray-500 dark:text-gray-600 mt-12">
                MochiDo 🐹 • {new Date().getFullYear()}
            </p>
        </div>
    );
}