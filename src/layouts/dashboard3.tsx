import {
  AppBar,
  Box,
  BoxProps,
  Button,
  Card,
  CircularProgress,
  Container,
  Grid,
  Icon,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Stack,
  StackProps,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import Link from "next/link";
import React from "react";

import { RiQuillPenFill } from "react-icons/ri";
import {
  MdAccountCircle,
  MdApps,
  MdCheck,
  MdContacts,
  MdLogout,
  MdNoteAlt,
} from "react-icons/md";
import useLogoutMutation from "@/hooks/useLogoutMutation";
import toast from "react-hot-toast";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import getErrorMessage from "@/utils/axios-error-handling/get-error-message";
import NiceModal from "@ebay/nice-modal-react";
import AccountModal from "@/modals/account-modal";

export interface Dashboard2LayoutProps extends StackProps {}

const Dashboard3Layout = (props: Dashboard2LayoutProps) => {
  const { children, ...restProps } = props;

  const logoutMutation = useLogoutMutation();

  return (
    <Stack {...restProps} alignItems="center" height="100vh">
      <AppBar>
        <Toolbar>
          <Link href="/dashboard" style={{ all: "unset" }}>
            <Tooltip title="Open Homepage">
              <Button color="inherit" startIcon={<RiQuillPenFill />}>
                <Typography
                  noWrap
                  variant="h6"
                  component="span"
                  color="inherit"
                  textTransform="none"
                >
                  EasyNotes
                </Typography>
              </Button>
            </Tooltip>
          </Link>
          <Stack
            direction="row"
            flexGrow={1}
            justifyContent="flex-end"
            alignItems="center"
            spacing={{
              xs: 1,
              sm: 2,
            }}
          >
            {/* TODO: Implement Apps Dropdown */}
            <PopupState variant="popover">
              {(popupState) => (
                <>
                  <Tooltip title="Switch App">
                    <IconButton color="inherit" {...bindTrigger(popupState)}>
                      <MdApps />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    {...bindMenu(popupState)}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                  >
                    <MenuList>
                      <Link href="/dashboard/notes" style={{ all: "unset" }}>
                        <MenuItem onClick={popupState.close}>
                          <ListItemIcon>
                            <MdContacts />
                          </ListItemIcon>
                          <ListItemText>Notes</ListItemText>
                        </MenuItem>
                      </Link>
                      <Link href="/dashboard/contacts" style={{ all: "unset" }}>
                        <MenuItem onClick={popupState.close}>
                          <ListItemIcon>
                            <MdNoteAlt />
                          </ListItemIcon>
                          <ListItemText>Contacts</ListItemText>
                        </MenuItem>
                      </Link>
                    </MenuList>
                  </Menu>
                </>
              )}
            </PopupState>

            {/* TODO: Implement Profile modal */}
            <Tooltip title="Open Account Modal">
              <IconButton
                color="inherit"
                onClick={() => NiceModal.show(AccountModal)}
              >
                <MdAccountCircle />
              </IconButton>
            </Tooltip>

            <Tooltip title="Logout">
              <IconButton
                color="inherit"
                onClick={() =>
                  logoutMutation.mutateAsync().catch((error) => {
                    const errorMessage = getErrorMessage(error);
                    if (typeof errorMessage === "string")
                      toast.error(errorMessage);
                  })
                }
              >
                {(logoutMutation.isLoading && (
                  <CircularProgress size="1em" color="inherit" />
                )) || <MdLogout />}
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>
      <Toolbar />
      {children}
    </Stack>
  );
};

export default Dashboard3Layout;
