import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Box,
  Typography,
  TableContainer,
  Paper,
} from "@mui/material";
const tableSx = {
  tableLayout: "fixed" as const,
  width: "100%",
  minWidth: 0,
};

const containerSx = {
  // Page scrolls; no inner scroll trap on narrow viewports
  overflowX: { xs: "hidden", md: "visible" },
  overflowY: "visible",
  maxHeight: "none",
  border: "1px solid #E9ECEF",
  borderRadius: "6px",
  background: "#FFFFFF",
};

export default function ItemsTable({
  stockItems,
  quantities,
  subtotals,
  onQuantityChange,
  readOnly = false,
}) {
  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: 700,
          color: "#2D6A4F",
          fontSize: { xs: "1.25rem", sm: "1.5rem" },
        }}
      >
        Product Listings {readOnly && "(View Only)"}
      </Typography>
      <TableContainer component={Paper} elevation={0} sx={containerSx}>
        <Table size="small" sx={tableSx}>
          <TableHead>
            <TableRow
              sx={{ background: "linear-gradient(135deg, #F8F9FA 0%, #E8F5E9 100%)" }}
            >
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: "#2D6A4F",
                  py: { xs: 1.25, sm: 2 },
                  px: { xs: 0.75, sm: 2 },
                  width: { xs: "40%", sm: "38%" },
                  minWidth: 0,
                }}
              >
                Item
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: "#2D6A4F",
                  py: { xs: 1.25, sm: 2 },
                  px: { xs: 0.5, sm: 2 },
                  width: { xs: "17%", sm: "15%" },
                  textAlign: "right",
                  whiteSpace: "nowrap",
                }}
              >
                Price
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: "#2D6A4F",
                  py: { xs: 1.25, sm: 2 },
                  px: { xs: 0.35, sm: 2 },
                  width: { xs: "2.75rem", sm: "6.5rem" },
                  maxWidth: { xs: "2.85rem", sm: "7rem" },
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                  Quantity
                </Box>
                <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
                  Qty
                </Box>
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: "#2D6A4F",
                  py: { xs: 1.25, sm: 2 },
                  px: { xs: 0.5, sm: 2 },
                  width: { xs: "auto", sm: "22%" },
                  minWidth: 0,
                  textAlign: "right",
                }}
              >
                <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                  Total Price
                </Box>
                <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
                  Total
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stockItems.map((item) => (
              <TableRow
                key={item.SKU}
                sx={{
                  "&:nth-of-type(odd)": {
                    backgroundColor: "#FAFBFC",
                  },
                  "&:hover": {
                    backgroundColor: "#F1F8F4",
                  },
                  transition: "background-color 0.2s ease",
                }}
              >
                <TableCell
                  sx={{
                    fontWeight: 500,
                    color: "#212529",
                    fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                    px: { xs: 0.75, sm: 2 },
                    py: { xs: 1, sm: 1.5 },
                    minWidth: 0,
                    overflowWrap: "anywhere",
                    wordBreak: "break-word",
                  }}
                >
                  {item.Name}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#52B788",
                    fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                    px: { xs: 0.5, sm: 2 },
                    py: { xs: 1, sm: 1.5 },
                    textAlign: "right",
                    whiteSpace: "nowrap",
                  }}
                >
                  ${(item.Price || 0).toFixed(2)}
                </TableCell>
                <TableCell
                  sx={{
                    px: { xs: 0.35, sm: 1.5 },
                    py: { xs: 0.75, sm: 1.25 },
                    width: { xs: "2.75rem", sm: "6.5rem" },
                    maxWidth: { xs: "2.85rem", sm: "7rem" },
                    verticalAlign: "middle",
                  }}
                >
                  <TextField
                    type="text"
                    inputMode="numeric"
                    value={quantities[item.SKU]}
                    onChange={(e) => onQuantityChange(e, item.SKU)}
                    inputProps={{
                      maxLength: 3,
                      pattern: "[0-9]*",
                      "aria-label": `Quantity for ${item.Name}`,
                      autoComplete: "off",
                    }}
                    onKeyDown={(e) => {
                      if (
                        e.key === "." ||
                        e.key === "-" ||
                        e.key === "e" ||
                        e.key === "E"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    size="small"
                    disabled={readOnly}
                    fullWidth
                    sx={{
                      maxWidth: { xs: 52, sm: 96 },
                      "& .MuiInputBase-root": {
                        width: { xs: 52, sm: "100%" },
                      },
                      "& .MuiInputBase-input": {
                        minHeight: { xs: 36, sm: 40 },
                        boxSizing: "border-box",
                        fontWeight: 600,
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                        textAlign: "center",
                        paddingLeft: "6px",
                        paddingRight: "6px",
                      },
                    }}
                  />
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#2D6A4F",
                    fontSize: { xs: "0.8125rem", sm: "1rem" },
                    px: { xs: 0.5, sm: 2 },
                    py: { xs: 1, sm: 1.5 },
                    textAlign: "right",
                    whiteSpace: "nowrap",
                    minWidth: 0,
                  }}
                >
                  ${subtotals[item.SKU]}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
