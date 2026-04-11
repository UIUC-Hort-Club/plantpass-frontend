import React from "react";
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Alert,
} from "@mui/material";
import { ReceiptProps } from "../../../types";

const readOnlyItemsTableSx = {
  tableLayout: "fixed" as const,
  width: "100%",
  minWidth: 0,
};

const readOnlyTableContainerSx = {
  // Match ItemsTable: page scrolls; avoid inner horizontal scroll on narrow viewports
  overflowX: { xs: "hidden", md: "visible" } as const,
  overflowY: "visible",
  maxHeight: "none",
};

function Receipt({ totals, transactionId, discounts = [], voucher = 0, transaction, readOnly = false }: ReceiptProps) {
  // If transaction object is provided, extract data from it
  let displayTransactionId = transactionId;
  let displayDiscounts = discounts;
  let displayVoucher = voucher;
  let displayTotals = totals;
  let displayItems = [];

  if (transaction) {
    displayTransactionId = transaction.purchase_id;
    displayDiscounts = transaction.discounts || [];
    displayVoucher = transaction.voucher || 0;
    displayItems = transaction.items || [];
    
    // Calculate totals from transaction
    const subtotal = displayItems.reduce((sum, item) => 
      sum + (item.price_ea * item.quantity), 0
    );
    const totalDiscounts = displayDiscounts.reduce((sum, discount) => 
      sum + (discount.amount_off || 0), 0
    );
    const grandTotal = subtotal - totalDiscounts - displayVoucher;
    
    displayTotals = {
      subtotal,
      grandTotal
    };
  }

  return (
    <Container
      sx={{ mt: 3 }}
      style={{ paddingLeft: "0px", paddingRight: "0px" }}
    >
      <Box
        sx={{
          border: "2px solid #d3d3d3",
          borderRadius: 2,
          padding: 2,
        }}
      >
        <Typography variant="h6" gutterBottom color={"black"} align="center">
          {readOnly ? "Order Details" : "Transaction Receipt"}
        </Typography>

        {displayTransactionId ? (
          <Alert severity="success">
            <strong>{readOnly ? "Order ID" : "Transaction ID"}:</strong> {displayTransactionId}
          </Alert>
        ) : (
          <Alert severity="warning">No transaction ID found.</Alert>
        )}

        {/* Items table for read-only mode */}
        {readOnly && displayItems.length > 0 && (
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ mt: 2, mb: 2, ...readOnlyTableContainerSx }}
          >
            <Table size="small" sx={readOnlyItemsTableSx}>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      py: { xs: 1, sm: 1.25 },
                      px: { xs: 0.75, sm: 2 },
                      width: { xs: "40%", sm: "42%" },
                      minWidth: 0,
                    }}
                  >
                    <strong>Item</strong>
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      py: { xs: 1, sm: 1.25 },
                      px: { xs: 0.35, sm: 2 },
                      width: { xs: "12%", sm: "11%" },
                      whiteSpace: "nowrap",
                    }}
                  >
                    <strong>Qty</strong>
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      py: { xs: 1, sm: 1.25 },
                      px: { xs: 0.35, sm: 2 },
                      width: { xs: "22%", sm: "22%" },
                      whiteSpace: "nowrap",
                    }}
                  >
                    <strong>Price</strong>
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      py: { xs: 1, sm: 1.25 },
                      px: { xs: 0.35, sm: 2 },
                      width: { xs: "26%", sm: "25%" },
                      whiteSpace: "nowrap",
                    }}
                  >
                    <strong>Total</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell
                      sx={{
                        fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                        px: { xs: 0.75, sm: 2 },
                        py: { xs: 0.75, sm: 1 },
                        minWidth: 0,
                        overflowWrap: "anywhere",
                        wordBreak: "break-word",
                      }}
                    >
                      {item.item}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                        px: { xs: 0.35, sm: 2 },
                        py: { xs: 0.75, sm: 1 },
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.quantity}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                        px: { xs: 0.35, sm: 2 },
                        py: { xs: 0.75, sm: 1 },
                        whiteSpace: "nowrap",
                      }}
                    >
                      ${Number(item.price_ea).toFixed(2)}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                        px: { xs: 0.35, sm: 2 },
                        py: { xs: 0.75, sm: 1 },
                        whiteSpace: "nowrap",
                      }}
                    >
                      ${(item.price_ea * item.quantity).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Typography
          variant="body1"
          sx={{ mb: 1 }}
          color={"black"}
          align="right"
        >
          Subtotal: ${Number(displayTotals?.subtotal || 0).toFixed(2)}
        </Typography>

        <TableContainer component={Paper} elevation={0} sx={readOnlyTableContainerSx}>
          <Table size="small" sx={readOnlyItemsTableSx}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    width: "62%",
                    minWidth: 0,
                    py: { xs: 1, sm: 1.25 },
                    px: { xs: 0.75, sm: 2 },
                  }}
                >
                  <strong>Discount Name</strong>
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    width: "38%",
                    py: { xs: 1, sm: 1.25 },
                    px: { xs: 0.5, sm: 2 },
                    whiteSpace: "nowrap",
                  }}
                >
                  <strong>Value</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayDiscounts.length === 0 && displayVoucher === 0 ? (
                <TableRow>
                  <TableCell sx={{ color: "gray", fontStyle: "italic", minWidth: 0, overflowWrap: "anywhere" }}>
                    n/a
                  </TableCell>
                  <TableCell sx={{ color: "gray", fontStyle: "italic" }}>n/a</TableCell>
                </TableRow>
              ) : (
                <>
                  {displayDiscounts.map((discount, index) => (
                    <TableRow key={index}>
                      <TableCell
                        sx={{
                          color: discount.amount_off > 0 ? "black" : "gray",
                          fontStyle: discount.amount_off > 0 ? "normal" : "italic",
                          minWidth: 0,
                          overflowWrap: "anywhere",
                          wordBreak: "break-word",
                          px: { xs: 0.75, sm: 2 },
                          py: { xs: 0.75, sm: 1 },
                          fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                        }}
                      >
                        {discount.name}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: discount.amount_off > 0 ? "black" : "gray",
                          fontStyle: discount.amount_off > 0 ? "normal" : "italic",
                          px: { xs: 0.5, sm: 2 },
                          py: { xs: 0.75, sm: 1 },
                          whiteSpace: "nowrap",
                          fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                        }}
                      >
                        -${Number(discount.amount_off || 0).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}

                  {displayVoucher > 0 && (
                    <TableRow>
                      <TableCell
                        sx={{
                          px: { xs: 0.75, sm: 2 },
                          py: { xs: 0.75, sm: 1 },
                          fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                        }}
                      >
                        Club Voucher
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          px: { xs: 0.5, sm: 2 },
                          py: { xs: 0.75, sm: 1 },
                          whiteSpace: "nowrap",
                          fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                        }}
                      >
                        -${Number(displayVoucher).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack
          direction="row"
          justifyContent="right"
          alignItems="center"
          sx={{ marginBottom: "10px" }}
        >
          <Typography
            variant="body1"
            sx={{ mt: 2, fontWeight: 700 }}
            color="black"
            align="right"
          >
            Grand Total: ${Number(displayTotals?.grandTotal || 0).toFixed(2)}
          </Typography>
        </Stack>
      </Box>
    </Container>
  );
}

export default Receipt;
