"use client";

import { useMemo } from "react";

import { motion } from "framer-motion";
import { Shield, Users, Lock, Activity, TrendingUp, TrendingDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRolesStore, getRoleStats } from "@/stores/roles-store";

const stats = [
  {
    id: "total",
    label: "Total Roles",
    icon: Shield,
    gradient: "from-blue-500 to-cyan-500",
    key: "totalRoles" as const,
    trend: 12,
  },
  {
    id: "users",
    label: "Active Users",
    icon: Users,
    gradient: "from-purple-500 to-pink-500",
    key: "activeUsers" as const,
    trend: 8,
  },
  {
    id: "permissions",
    label: "Permissions",
    icon: Lock,
    gradient: "from-orange-500 to-red-500",
    key: "totalPermissions" as const,
    trend: -3,
  },
  {
    id: "system",
    label: "System Roles",
    icon: Activity,
    gradient: "from-green-500 to-emerald-500",
    key: "systemRoles" as const,
    trend: 0,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function RoleStats() {
  const roles = useRolesStore((state) => state.roles);
  const setFilterCategory = useRolesStore((state) => state.setFilterCategory);

  // Compute stats with memoization
  const roleStats = useMemo(() => getRoleStats({ roles } as any), [roles]);

  const handleStatClick = (statId: string) => {
    if (statId === "system") {
      setFilterCategory("system");
    } else {
      setFilterCategory("all");
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {stats.map((stat, index) => {
        const value = roleStats[stat.key];
        const Icon = stat.icon;

        return (
          <motion.div
            key={stat.id}
            variants={item}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group bg-card relative cursor-pointer overflow-hidden rounded-lg border p-6 transition-shadow hover:shadow-lg"
            onClick={() => handleStatClick(stat.id)}
          >
            <div className="flex items-center justify-between">
              <div className={cn("rounded-full p-3", "bg-gradient-to-br", stat.gradient)}>
                <Icon className="h-6 w-6 text-white" />
              </div>

              {stat.trend !== 0 && (
                <Badge variant={stat.trend > 0 ? "default" : "secondary"} className="gap-1">
                  {stat.trend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(stat.trend)}%
                </Badge>
              )}
            </div>

            <div className="mt-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                className="text-3xl font-bold"
              >
                {value}
              </motion.div>
              <p className="text-muted-foreground mt-1 text-sm">{stat.label}</p>
            </div>

            {/* Hover gradient overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className={cn(
                "pointer-events-none absolute inset-0 rounded-lg",
                "from-primary/5 bg-gradient-to-t to-transparent",
              )}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
