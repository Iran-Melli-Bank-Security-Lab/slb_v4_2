import * as React from 'react';
import { Box, Stack, Typography, Avatar, Link, Divider } from '@mui/material';
import {
  AccountPreview,
  AccountPopoverFooter,
  SignOutButton,
} from '@toolpad/core/Account';

// import { useSession } from '@toolpad/core/useSession';
import { useSession } from '../SessionContext';
export function UserOrg() {
  const session = useSession().session;
  console.log("session in line 13 : " , session )
  if (!session?.user) {
    return <Typography>No user session available</Typography>;
  }

  const { logo: orgLogo, firstName: orgName, image: orgUrl } = session?.user ;

  return (
    <Stack>
      <AccountPreview variant="expanded" />
      {session?.user && (
        <Stack mb={1}>
          {/* <Typography textAlign="center" fontSize="0.625rem" gutterBottom>
            This account is managed by
          </Typography> */}
          <Box display="flex" justifyContent="center" alignItems="center" gap={2}>
            {/* <Avatar
              variant="square"
              src={orgLogo}
              alt={orgName}
              sx={{ width: 27, height: 24 }}
            /> */}
            <Stack>
              {/* <Typography variant="caption" fontWeight="bolder">
                Profile 
              </Typography> */}
              <Link
                variant="caption"
                href="/profile"
                target="_blank"
                rel="noopener noreferrer"
              >
                 Profile
              </Link>
            </Stack>
          </Box>
        </Stack>
      )}
      <Divider />
      <AccountPopoverFooter>
        <SignOutButton />
      </AccountPopoverFooter>
    </Stack>
  );
}
