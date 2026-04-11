import { useState, useEffect, type ChangeEvent } from "react";
import {
  Box,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  Button,
  Stack,
  Divider,
  Alert,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useNotification } from "../../contexts/NotificationContext";
import { useFeatureToggles } from "../../contexts/FeatureToggleContext";
import { setFeatureToggles as saveFeatureToggles } from "../../api/feature_toggles_interface/setFeatureToggles";
import type { FeatureToggles } from "../../types";

export default function FeatureToggles() {
  const { showSuccess, showError } = useNotification();
  const { features: serverFeatures, refreshFeatureToggles } = useFeatureToggles();
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<FeatureToggles>(() => ({ ...serverFeatures }));

  useEffect(() => {
    setDraft({ ...serverFeatures });
  }, [serverFeatures]);

  const handleToggleChange = (featureName: keyof FeatureToggles) => (event: ChangeEvent<HTMLInputElement>) => {
    setDraft((prev) => ({
      ...prev,
      [featureName]: event.target.checked,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const saved = await saveFeatureToggles(draft);
      localStorage.setItem("featureToggles", JSON.stringify(saved));
      refreshFeatureToggles();
      showSuccess("Feature toggles saved.");
    } catch (error) {
      console.error("Error saving feature toggles:", error);
      showError("Failed to save feature toggles. Check your connection and admin session.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Feature Toggles
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Enable or disable features for the PlantPass application. Changes apply after a successful save
        (password protection for the admin console is enforced the next time someone opens it without an
        active admin session).
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Saving updates the server immediately. Other browser tabs pick up changes when they refresh or
        refocus the window.
      </Alert>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={draft.collectEmailAddresses}
                  onChange={handleToggleChange("collectEmailAddresses")}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body1" fontWeight={600}>
                    Collect E-mail Addresses
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    When enabled, customers can provide their email address during checkout.
                    When disabled, email field is hidden and an empty string is recorded.
                  </Typography>
                </Box>
              }
            />
          </Box>

          <Divider />

          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={draft.passwordProtectAdmin}
                  onChange={handleToggleChange("passwordProtectAdmin")}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body1" fontWeight={600}>
                    Password Protect Admin Console
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    When enabled, the next visit to the admin console (without an admin token) requires a
                    password. When disabled, the app obtains access without a password for that session.
                  </Typography>
                </Box>
              }
            />
          </Box>

          <Divider />

          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={draft.protectPlantPassAccess}
                  onChange={handleToggleChange("protectPlantPassAccess")}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body1" fontWeight={600}>
                    Protect PlantPass Access
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    When enabled, users must enter a passphrase to access the PlantPass checkout station.
                    When disabled, anyone can access the checkout station from the home screen.
                    To set or change the passphrase, go to the &ldquo;PlantPass Access&rdquo; tab.
                  </Typography>
                </Box>
              }
            />
          </Box>
        </Stack>

        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={saving}
            size="large"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
