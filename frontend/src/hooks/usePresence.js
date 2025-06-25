import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import { API_ROUTES } from "../constant/APIRoutes";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const CHANNEL_NAME = "online-users";
const HEARTBEAT_INTERVAL = 10000; 
const OFFLINE_TIMEOUT = 30000;

const updateUserStatus = async (userId, isActive) => {
    try {
        const response = await axios.post(API_ROUTES.UPDATE_USER_STATUS, {
            user_id: userId,
            is_active: isActive,
        });
        return response.data;
    } catch (error) {
        console.error("Error updating user status:", error);
        throw error;
    }
};

export const usePresence = (userId, onPresenceChange) => {
  const presenceMapRef = useRef({}); // No re-renders
  const lastHeartbeatRef = useRef(Date.now());
  const heartbeatTimerRef = useRef(null);
  const presenceChannelRef = useRef(null);

  const markOnline = async () => {
    lastHeartbeatRef.current = Date.now();
    updateUserStatus(userId, true);
  };

  const markOffline = async () => {
    updateUserStatus(userId, false);
  };

  const startHeartbeat = () => {
    heartbeatTimerRef.current = setInterval(() => {
      const now = Date.now();
      if (now - lastHeartbeatRef.current > OFFLINE_TIMEOUT) {
        console.warn("No heartbeat — marking offline");
        markOffline();
      } else {
        markOnline();
      }
    }, HEARTBEAT_INTERVAL);
  };

  useEffect(() => {
    if (!userId) return;

    const channel = supabase.channel(CHANNEL_NAME, {
      config: { presence: { key: userId.toString() } },
    });

    presenceChannelRef.current = channel;

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState(); // { userId: [meta1], ... }
        presenceMapRef.current = state;

        // Optional callback to notify UI
        if (onPresenceChange) {
          onPresenceChange(state);
        }
      })
      .on("presence", { event: "join" }, ({ key }) => {
        console.log(`User ${key} joined`);
        if (key === userId.toString()) markOnline();
      })
      .on("presence", { event: "leave" }, ({ key }) => {
        console.log(`User ${key} left`);
        if (key === userId.toString()) markOffline();
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({});
          markOnline();
          startHeartbeat();
        }
      });

    const handleUnload = async () => {
      clearInterval(heartbeatTimerRef.current);
      await channel.untrack();
      await markOffline();
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => {
      handleUnload();
      clearInterval(heartbeatTimerRef.current);
      channel.unsubscribe();
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [userId]);

  // Return presenceMapRef only if needed
  return presenceMapRef;
};