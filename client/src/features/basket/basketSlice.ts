import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import agent from "../../app/api/agent";
import { Basket } from "../../app/models/basket"

interface BasketState {
    basket: Basket | null;
    status: string;
}

const initialState: BasketState = {
    basket: null,
    status: 'idle'
}

export const addBasketItemAsync = createAsyncThunk<Basket, { productid: number, quantity?: number }>(
    'basket/addBasketItemAsync',
    async ({ productid, quantity = 1 }, thunkAPI) => {
        try {
            return await agent.Basket.addItem(productid, quantity);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data })
        }
    }
)

export const removeBasketItemAsync = createAsyncThunk<void,
    { productid: number, quantity: number, name?: string }>(
        'basket/removeBasketItemAsync',
        async ({ productid, quantity }, thunkAPI) => {
            try {
                await agent.Basket.removeItem(productid, quantity);
            } catch (error:any) {
                return thunkAPI.rejectWithValue({error:error.data});
            }
        }
    )

export const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {
        setBasket: (state, action) => {
            state.basket = action.payload
        }
    },
    extraReducers: (builder => {
        builder.addCase(addBasketItemAsync.pending, (state, action) => {
            console.log(action);
            state.status = 'pendingAddItem' + action.meta.arg.productid;
        });
        builder.addCase(addBasketItemAsync.fulfilled, (state, action) => {
            state.basket = action.payload;
            state.status = 'idle';
        });
        builder.addCase(addBasketItemAsync.rejected, (state, action) => {
            console.log(action.payload);
            state.status = 'idle';
        });
        builder.addCase(removeBasketItemAsync.pending, (state, action) => {
            state.status = 'pendingRemoveItem' + action.meta.arg.productid + action.meta.arg.name;
        });
        builder.addCase(removeBasketItemAsync.fulfilled, (state, action) => {
            const { productid, quantity } = action.meta.arg;
            const ItemIndex = state.basket?.items.findIndex(i => i.productid === productid);
            if (ItemIndex === -1 || ItemIndex === undefined) return;
            state.basket!.items[ItemIndex].quantity -= quantity;
            if (state.basket?.items[ItemIndex].quantity === 0)
                state.basket.items.splice(ItemIndex, 1);
            state.status = 'idle';
        });
        builder.addCase(removeBasketItemAsync.rejected, (state, action) => {
            state.status = 'idle';
            console.log(action.payload);
        })
    })
})

export const { setBasket } = basketSlice.actions;