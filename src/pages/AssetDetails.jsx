import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  Divider,
  Button,
} from "@mui/material";
import { ArrowBack, InfoOutlined } from "@mui/icons-material";
import { getAsset } from "../api/asset/getAsset";

const AssetDetails = () => {
  const { assetId } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const data = await getAsset(assetId)
        setAsset(data.data || null );
      } catch (err) {
        console.error("❌ Error fetching asset details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAsset();
  }, [assetId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress color="primary" />
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Typography variant="h6" color="error">
          Asset not found ⚠️
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Back
        </Button>
      </div>
    );
  }

  const renderValue = (label, value) => (
    <div className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition">
      <Typography variant="subtitle2" className="text-gray-600">
        {label}
      </Typography>
      <Typography variant="body1" className="font-medium text-gray-800">
        {value
          ? value
          : <span className="text-gray-400 italic">🚫 No data available</span>}
      </Typography>
    </div>
  );

  const dateFormat = (date) =>
    date ? new Date(date).toLocaleDateString() : null;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Typography variant="h4" className="font-bold text-gray-800 flex items-center gap-2">
              <InfoOutlined color="primary" /> {asset.name}
            </Typography>
            <Typography variant="subtitle1" className="text-gray-500">
              Type: {asset.type.toUpperCase()}
            </Typography>
          </div>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </div>

        {/* Main Card */}
        <Card className="shadow-lg rounded-2xl">
          <CardContent className="p-6">
            {/* Status */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Chip label={`Status: ${asset.status}`} color="primary" />
              <Chip label={`Owner Type: ${asset.ownerType}`} color="secondary" />
              {asset.departmentScope?.map((dep) => (
                <Chip key={dep} label={`Dept: ${dep}`} color="success" />
              ))}
              {asset.platforms?.map((p) => (
                <Chip key={p} label={`Platform: ${p}`} variant="outlined" />
              ))}
            </div>

            <Divider className="my-4" />

            {/* Details Grid */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                {renderValue("Brand", asset.brand)}
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                {renderValue("Model", asset.model)}
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                {renderValue("Version", asset.version)}
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                {renderValue("Serial Number", asset.serialNumber)}
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                {renderValue("License Key", asset.licenseKey)}
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                {renderValue("MAC Address", asset.macAddress)}
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                {renderValue("IP Address", asset.ipAddress)}
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                {renderValue("Location", asset.location)}
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                {renderValue("Vendor", asset.vendor)}
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                {renderValue("Cost", asset.cost ? `$${asset.cost}` : null)}
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                {renderValue("Purchase Date", dateFormat(asset.purchaseDate))}
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                {renderValue("Warranty Expiry", dateFormat(asset.warrantyExpiry))}
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                {renderValue("Maintenance Schedule", dateFormat(asset.maintenanceSchedule))}
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                {renderValue("Assigned To", asset.assignedTo?.name)}
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                {renderValue("Assigned Date", dateFormat(asset.assignedDate))}
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                {renderValue("Software Type", asset.softwareType)}
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                {renderValue("License Status", asset.licenseStatus)}
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                {renderValue("License Expiry", dateFormat(asset.licenseExpiry))}
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                {renderValue("Install Date", dateFormat(asset.installDate))}
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                {renderValue("Allowed Installations", asset.allowedInstallations)}
              </Grid>
              <Grid item xs={12}>
                {renderValue("Description", asset.description)}
              </Grid>
            </Grid>

            <Divider className="my-4" />

            {/* Tags */}
            <div>
              <Typography variant="subtitle2" className="mb-2 text-gray-700">
                Tags:
              </Typography>
              <div className="flex flex-wrap gap-2">
                {asset.tags?.length ? (
                  asset.tags.map((tag) => (
                    <Chip key={tag} label={tag} variant="outlined" />
                  ))
                ) : (
                  <Typography variant="body2" className="text-gray-400 italic">
                    💡 No tags available
                  </Typography>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssetDetails;
