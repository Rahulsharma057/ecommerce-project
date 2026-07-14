"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
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
import MarkEmailUnreadOutlinedIcon from "@mui/icons-material/MarkEmailUnreadOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import ContactMailOutlinedIcon from "@mui/icons-material/ContactMailOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import ViewCarouselOutlinedIcon from "@mui/icons-material/ViewCarouselOutlined";
const DRAWER_OPEN = 230;
const DRAWER_CLOSED = 64;

const menus = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: <DashboardOutlinedIcon fontSize="small" />,
  }, {
    name: "Catogory Control",
    href: "/admin/attributes",
    icon: <Inventory2OutlinedIcon fontSize="small" />,
  },
   {
    name: "Payment Settings",
    href: "/admin/payment-settings",
    icon: <Inventory2OutlinedIcon fontSize="small" />,
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
  {
    name: "Careers",
    href: "/admin/careers",
    icon: <Inventory2OutlinedIcon fontSize="small" />,
  },
  {
    name: "fashion-section",
    href: "/admin/fashion-section",
    icon: <Inventory2OutlinedIcon fontSize="small" />,
  },

  {
    name: "Contacts",
    href: "/admin/contact",
    icon: <ContactMailOutlinedIcon fontSize="small" />,
  },
    {
    name: "model-showcase",
    href: "/admin/model-showcase",
    icon: <ContactMailOutlinedIcon fontSize="small" />,
  },
  {
    name: "Affiliates",
    href: "/admin/affiliates",
    icon: <GroupsOutlinedIcon fontSize="small" />,
  },/* {
  name: "Categories Highlights",
  href: "/admin/category-highlights",
  icon: <CategoryOutlinedIcon fontSize="small" />,
}, */{
  name: "Home Collections",
  href: "/admin/home-collections",
  icon: <ViewCarouselOutlinedIcon fontSize="small" />,
},
  {
    name: "Press",
    href: "/admin/press",
    icon: <CampaignOutlinedIcon fontSize="small" />,
  }, {
    name: "luxury-story",
    href: "/admin/luxury-story",
    icon: <CampaignOutlinedIcon fontSize="small" />,
  },
  {
    name: "NewsLetter Emails",
    href: "/admin/newsletter",
    icon: <MarkEmailUnreadOutlinedIcon fontSize="small" />,
  },
 
  {
    name: "Advertisements",
    href: "/admin/advertisements",
    icon: <CampaignOutlinedIcon fontSize="small" />,
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
          sx={{ px: open ? 2 : 0, py: 1, minHeight: 60 }}
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
      <List
  sx={{
    px: 1,
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",

    "&::-webkit-scrollbar": {
      width: 6,
    },

    "&::-webkit-scrollbar-track": {
      background: "transparent",
    },

    "&::-webkit-scrollbar-thumb": {
      background: "#3f3f46",
      borderRadius: 10,
    },

    "&::-webkit-scrollbar-thumb:hover": {
      background: "#52525b",
    },
  }}
>
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
                      // mb: 0.5,
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
