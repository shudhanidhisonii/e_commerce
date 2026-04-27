import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allProducts: [],
  products: [],
  cart: {
    items: [],
    totalPrice: 0,
  },
  addresses:[],
  selectedAddress:null //currently chosen address

};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setAllProducts: (state, action) => {
      state.allProducts = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setCart: (state, action) => {
      state.cart = action.payload; // 🔥 overwrite only
    },
    clearCart: (state) => {
      state.cart = {
        items: [],
        totalPrice: 0,
      };
    },
    //Address Management
    addAddress:(state,action)=>{
      if(!state.addresses) state.addresses=[];
      state.addresses.push(action.payload)
    },
    setSelectedAddress:(state, action)=>{
      state.selectedAddress= action.payload
    },
    deleteAddress:(state,action)=>{
      state.addresses= state.addresses.filter((_,index)=>index !== action.payload)

      //reset selectedAddress idf it must deleted
      if(state.selectedAddress === action.payload){
        state.selectedAddress= null
      }
    }

  },
});

export const {
  setAllProducts,
  setProducts,
  setCart,
  clearCart,
  addAddress, setSelectedAddress, deleteAddress
} = productSlice.actions;

export default productSlice.reducer;
