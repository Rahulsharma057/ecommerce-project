"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Box,
  Drawer,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";

const DRAWER_OPEN = 230;
const DRAWER_CLOSED = 64;

const menus = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: <DashboardOutlinedIcon fontSize="small" />,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: <Inventory2OutlinedIcon fontSize="small" />,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: <ShoppingBagOutlinedIcon fontSize="small" />,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: <PeopleOutlinedIcon fontSize="small" />,
  },
  {
    name: "Coupons",
    href: "/admin/coupons",
    icon: <LocalOfferOutlinedIcon fontSize="small" />,
  },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  return (
    <Box sx={{ display: "flex" }}>
      {/* ── SIDEBAR ── */}
      <Box
        sx={{
          width: open ? DRAWER_OPEN : DRAWER_CLOSED,
          flexShrink: 0,

          position: "fixed",

          left: 0,
          height: "100vh",
          bgcolor: "#18181b",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.22s cubic-bezier(.4,0,.2,1)",
          overflow: "hidden",
          zIndex: 1200,
        }}
      >
        {/* BRAND ROW */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent={open ? "space-between" : "center"}
          sx={{ px: open ? 2 : 0, py: 2.2, minHeight: 60 }}
        >
          {open && (
            <Typography
              fontWeight={800}
              fontSize={15}
              letterSpacing={0.3}
              color="#f4f4f5"
              noWrap
            >
              Admin Panel
            </Typography>
          )}

          <IconButton
            onClick={() => setOpen((p) => !p)}
            size="small"
            sx={{
              color: "#a1a1aa",
              "&:hover": { color: "#fff", bgcolor: "#27272a" },
            }}
          >
            {open ? (
              <MenuOpenIcon fontSize="small" />
            ) : (
              <MenuIcon fontSize="small" />
            )}
          </IconButton>
        </Stack>

        <Divider sx={{ borderColor: "#27272a" }} />

        {/* NAV ITEMS */}
        <List sx={{ px: 1, pt: 1.5, flex: 1 }}>
          {menus.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname?.startsWith(item.href);

            return (
              <Tooltip
                key={item.href}
                title={!open ? item.name : ""}
                placement="right"
                arrow
              >
                <Link
                  href={item.href}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <ListItemButton
                    sx={{
                      borderRadius: 1.5,
                      mb: 0.5,
                      minHeight: 42,
                      px: 1.5,
                      justifyContent: open ? "flex-start" : "center",
                      bgcolor: isActive ? "#3f3f46" : "transparent",
                      "&:hover": { bgcolor: "#27272a" },
                      transition: "background 0.15s",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 1.5 : 0,
                        color: isActive ? "#fff" : "#71717a",
                        transition: "margin 0.22s",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>

                    {open && (
                      <ListItemText
                        primary={item.name}
                        primaryTypographyProps={{
                          fontSize: 13,
                          fontWeight: isActive ? 700 : 400,
                          color: isActive ? "#f4f4f5" : "#a1a1aa",
                          noWrap: true,
                        }}
                      />
                    )}
                  </ListItemButton>
                </Link>
              </Tooltip>
            );
          })}
        </List>

        <Divider sx={{ borderColor: "#27272a" }} />

        {/* BOTTOM — version tag */}
        <Box
          sx={{
            py: 1.5,
            px: open ? 2 : 0,
            display: "flex",
            justifyContent: open ? "flex-start" : "center",
          }}
        >
          <Typography fontSize={11} color="#52525b" noWrap>
            {open ? "v1.0.0 · Admin" : "v1"}
          </Typography>
        </Box>
      </Box>

      {/* ── MAIN CONTENT ── */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#f4f6f9",
          minHeight: "100vh",
          width: "100%",
          ml: open ? "230px" : "64px",
          transition: "margin 0.22s cubic-bezier(.4,0,.2,1)",
          overflowX: "auto", // 👈 IMPORTANT
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
