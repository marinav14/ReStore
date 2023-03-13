import { Add, Delete, Remove } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useState } from "react"
import { Link } from "react-router-dom";
import agent from "../../app/api/agent";
import { useStoreContext } from "../../app/context/StoreContext";
import { currencyFormat } from "../../app/util/util";
import BasketSummary from "./BasketSummary";

export default function BasketPage(): JSX.Element {

  const { basket, setBasket, removeItem } = useStoreContext();
  const [status, setStatus] = useState({
    loading: false,
    name: ''
  });

  function handleAddItem(productId: number, name: string) {
    setStatus({ loading: true, name });
    agent.Basket.addItem(productId)
      .then(basket => setBasket(basket))
      .catch(error => console.log(error))
      .finally(() => setStatus({ loading: false, name: '' }))
  }

  function handleRemoveItem(productId: number, quanity = 1, name: string) {
    setStatus({ loading: true, name });
    agent.Basket.removeItem(productId, quanity)
      .then(() => removeItem(productId, quanity))
      .catch(error => console.log(error))
      .finally(() => setStatus({ loading: false, name: '' }))
  }

  if (!basket) return <Typography variant="h3">Your basket is empty</Typography>

  return (
    <>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="center">Quantity</TableCell>
            <TableCell align="right">Subtotal</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {basket.items.map(item => (
            <TableRow
              key={item.productid}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Box display='flex' alignItems='center'>
                  <img src={item.pictureUrl} alt={item.name} style={{ height: 50, marginRight: 20 }} />
                  <span>{item.name}</span>
                </Box>
              </TableCell>
              <TableCell align="right">{currencyFormat(item.price)}</TableCell>
              <TableCell align="center">
                <LoadingButton
                  loading={status.loading && status.name === 'rem' + item.productid}
                  onClick={() => handleRemoveItem(item.productid, 1, 'rem' + item.productid)}
                  color='error'>
                  <Remove />
                </LoadingButton>
                {item.quantity}
                <LoadingButton
                  loading={status.loading && status.name === 'add' + item.productid}
                  onClick={() => handleAddItem(item.productid, 'add' + item.productid)}
                  color='secondary'>
                  <Add />
                </LoadingButton>
              </TableCell>
              <TableCell align="right">${((item.price / 100) * item.quantity).toFixed(2)}</TableCell>
              <TableCell align="right">
                <LoadingButton 
                loading={status.loading && status.name === 'del' + item.productid} 
                onClick={() => handleRemoveItem(item.productid, item.quantity, 'del' + item.productid)} 
                color="error">
                  <Delete />
                </LoadingButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <Grid container>
      <Grid item xs={6}/>
      <Grid item xs={6}>
        <BasketSummary/>
        <Button
        component={Link}
        to='/checkout'
        variant='contained'
        size='large'
        fullWidth
        >
          Checkout
        </Button>
      </Grid>
    </Grid>
    </>
  )
}