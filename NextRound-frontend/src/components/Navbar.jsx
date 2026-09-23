import {
    Search,
    Zap,
    LogIn,
    UserCircle,
    LogOut,
    Bell,
} from 'lucide-react';

import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function Navbar() {
    const { user, logout } = useAuth();

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loadingNotifications, setLoadingNotifications] =
        useState(false);

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] =
        useState(false);

    const profileRef = useRef(null);
    const notificationsRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setIsProfileOpen(false);
            }

            if (
                notificationsRef.current &&
                !notificationsRef.current.contains(event.target)
            ) {
                setIsNotificationsOpen(false);
            }
        };

        document.addEventListener(
            'mousedown',
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                'mousedown',
                handleClickOutside
            );
        };
    }, []);

    const handleProfileToggle = () => {
        setIsProfileOpen((prev) => !prev);
        setIsNotificationsOpen(false);
    };

    const handleNotificationsToggle = () => {
        setIsNotificationsOpen((prev) => !prev);
        setIsProfileOpen(false);
    };

    const handleLogout = async () => {
        await logout();

        setIsProfileOpen(false);
        setIsNotificationsOpen(false);
    };

useEffect(() => {
    if (!user) {
        setNotifications([]);
        setUnreadCount(0);
        setLoadingNotifications(false);
        return;
    }

    const loadNotifications = async () => {
        try {
            setLoadingNotifications(true);

            const response = await api.get('/notifications');

            const notificationsData =
                response.data.notifications ??
                response.data ??
                [];

            setNotifications(notificationsData);

            const unread = notificationsData.filter(
                (notification) => !notification.is_read
            ).length;

            setUnreadCount(unread);
        } catch (error) {
            console.error(
                'Error loading notifications:',
                error.response?.data || error.message
            );

            setNotifications([]);
            setUnreadCount(0);
        } finally {
            setLoadingNotifications(false);
        }
    };

    loadNotifications();
}, [user]);

    const handleMarkAsRead = async (notificationId) => {
        const notification = notifications.find(
            (item) => item.id === notificationId
        );

        if (!notification || notification.is_read) {
            return;
        }

        try {
            await api.put(
                `/notifications/${notificationId}/read`
            );

            setNotifications((previous) =>
                previous.map((item) =>
                    item.id === notificationId
                        ? {
                              ...item,
                              is_read: true,
                          }
                        : item
                )
            );

            setUnreadCount((previous) =>
                Math.max(previous - 1, 0)
            );
        } catch (error) {
            console.error(
                'Error marking notification as read:',
                error.response?.data || error.message
            );
        }
    };

    const handleMarkAllAsRead = async () => {
        if (unreadCount === 0) {
            return;
        }

        try {
            await api.put(
                '/notifications/read-all'
            );

            setNotifications((previous) =>
                previous.map((notification) => ({
                    ...notification,
                    is_read: true,
                }))
            );

            setUnreadCount(0);
        } catch (error) {
            console.error(
                'Error marking all notifications as read:',
                error.response?.data || error.message
            );
        }
    };

    return (
        <nav className="relative z-[100] border-b border-white/10 bg-[#0B0F19]/95 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-2"
                >
                    <Zap
                        size={28}
                        className="fill-[#7C3AED] text-[#7C3AED]"
                    />

                    <span className="text-xl font-black tracking-tight text-white">
                        NEXTROUND
                    </span>
                </Link>

                {/* Navigation */}
                <div className="hidden items-center gap-8 md:flex">

                    <Link
                        to="/tournaments"
                        className="text-sm text-gray-300 transition hover:text-white"
                    >
                        Tournaments
                    </Link>

                    <Link
                        to="/games"
                        className="text-sm text-gray-300 transition hover:text-white"
                    >
                        Games
                    </Link>

                    <Link
                        to="/rankings"
                        className="text-sm text-gray-300 transition hover:text-white"
                    >
                        Rankings
                    </Link>

                    <Link
                        to="/about"
                        className="text-sm text-gray-300 transition hover:text-white"
                    >
                        About
                    </Link>

                </div>

                {/* Right side */}
                <div className="flex items-center gap-4">

                    {/* Search */}
                    <div className="hidden items-center rounded-lg border border-white/15 bg-[#111827] px-3 py-2 lg:flex">

                        <Search
                            size={16}
                            className="mr-2 text-gray-500"
                        />

                        <input
                            type="text"
                            placeholder="Search tournaments..."
                            className="w-44 bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
                        />

                    </div>

                    {user ? (
                        <>

                            {/* Notifications */}
                            <div
                                ref={notificationsRef}
                                className="relative"
                            >
                                <button
                                    onClick={
                                        handleNotificationsToggle
                                    }
                                    className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white/5 hover:text-white"
                                    aria-label="Notifications"
                                >
                                    <Bell size={20} />

                                    {/* Unread badge */}
                                    {unreadCount > 0 && (
                                        <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#8B5CF6] px-1 text-[10px] font-bold text-white ring-2 ring-[#0B0F19]">
                                            {unreadCount > 9
                                                ? '9+'
                                                : unreadCount}
                                        </span>
                                    )}
                                </button>

                                {isNotificationsOpen && (
                                    <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-xl border border-white/10 bg-[#111827] shadow-2xl">

                                        {/* Notification header */}
                                        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">

                                            <h3 className="font-semibold text-white">
                                                Notifications

                                                {unreadCount > 0 && (
                                                    <span className="ml-2 text-xs font-normal text-[#A78BFA]">
                                                        {unreadCount}{' '}
                                                        unread
                                                    </span>
                                                )}
                                            </h3>

                                            <button
                                                onClick={
                                                    handleMarkAllAsRead
                                                }
                                                disabled={
                                                    unreadCount ===
                                                    0
                                                }
                                                className="text-xs text-[#A78BFA] transition hover:text-[#C4B5FD] disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                Mark all as read
                                            </button>

                                        </div>

                                        {/* Notifications list */}
                                        <div className="max-h-80 overflow-y-auto">

                                            {loadingNotifications ? (
                                                <div className="px-4 py-8 text-center text-sm text-gray-500">
                                                    Loading
                                                    notifications...
                                                </div>
                                            ) : notifications.length ===
                                              0 ? (
                                                <div className="px-4 py-8 text-center text-sm text-gray-500">
                                                    No notifications
                                                    yet.
                                                </div>
                                            ) : (
                                                notifications
                                                    .slice(0, 10)
                                                    .map(
                                                        (
                                                            notification
                                                        ) => (
                                                            <button
                                                                key={
                                                                    notification.id
                                                                }
                                                                onClick={() =>
                                                                    handleMarkAsRead(
                                                                        notification.id
                                                                    )
                                                                }
                                                                className={`flex w-full gap-3 border-b border-white/5 px-4 py-4 text-left transition hover:bg-white/5 ${
                                                                    !notification.is_read
                                                                        ? 'bg-white/[0.02]'
                                                                        : ''
                                                                }`}
                                                            >

                                                                {/* Unread indicator */}
                                                                {!notification.is_read ? (
                                                                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#8B5CF6]" />
                                                                ) : (
                                                                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-transparent" />
                                                                )}

                                                                <div className="min-w-0">

                                                                    <p
                                                                        className={`text-sm ${
                                                                            notification.is_read
                                                                                ? 'font-medium text-gray-300'
                                                                                : 'font-semibold text-white'
                                                                        }`}
                                                                    >
                                                                        {
                                                                            notification.title
                                                                        }
                                                                    </p>

                                                                    <p className="mt-1 text-xs leading-5 text-gray-400">
                                                                        {
                                                                            notification.message
                                                                        }
                                                                    </p>

                                                                    <p className="mt-2 text-xs text-gray-600">
                                                                        {new Date(
                                                                            notification.created_at
                                                                        ).toLocaleString()}
                                                                    </p>

                                                                </div>

                                                            </button>
                                                        )
                                                    )
                                            )}

                                        </div>

                                        {/* View all */}
                                        <div className="border-t border-white/10 px-4 py-3 text-center">

                                            <Link
                                                to="/notifications"
                                                onClick={() =>
                                                    setIsNotificationsOpen(
                                                        false
                                                    )
                                                }
                                                className="text-sm font-medium text-[#A78BFA] transition hover:text-[#C4B5FD]"
                                            >
                                                View all
                                                notifications
                                            </Link>

                                        </div>

                                    </div>
                                )}
                            </div>

                            {/* Profile */}
                            <div
                                ref={profileRef}
                                className="relative"
                            >
                                <button
                                    onClick={
                                        handleProfileToggle
                                    }
                                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-white/5"
                                >
                                    <UserCircle
                                        size={28}
                                        className="text-[#A78BFA]"
                                    />

                                    <span className="hidden text-sm font-medium text-white sm:block">
                                        {user.name}
                                    </span>
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 top-12 z-[100] w-48 rounded-xl border border-white/10 bg-[#111827] p-2 shadow-2xl">

                                        <Link
                                            to="/profile"
                                            onClick={() =>
                                                setIsProfileOpen(
                                                    false
                                                )
                                            }
                                            className="block rounded-lg px-3 py-2 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
                                        >
                                            Profile
                                        </Link>

                                        <Link
                                            to="/dashboard"
                                            onClick={() =>
                                                setIsProfileOpen(
                                                    false
                                                )
                                            }
                                            className="block rounded-lg px-3 py-2 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
                                        >
                                            Dashboard
                                        </Link>

                                        <div className="my-1 border-t border-white/10" />

                                        <button
                                            onClick={
                                                handleLogout
                                            }
                                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
                                        >
                                            <LogOut size={16} />
                                            Logout
                                        </button>

                                    </div>
                                )}
                            </div>

                        </>
                    ) : (
                        <>
                            {/* Guest */}
                            <Link
                                to="/login"
                                className="flex items-center gap-2 text-sm font-medium text-white transition hover:text-[#A78BFA]"
                            >
                                <LogIn size={16} />
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="rounded-lg bg-[#7C3AED] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6D28D9]"
                            >
                                Register
                            </Link>
                        </>
                    )}

                </div>
            </div>
        </nav>
    );
}

export default Navbar;