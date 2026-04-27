import React from 'react'
import { ShoppingCart } from 'lucide-react'
import { Skeleton } from './ui/skeleton'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { setCart } from '@/redux/productSlice'

const ProductCard = ({ product, loading }) => {
  const { productImg, productPrice, productName } = product
  const accessToken = localStorage.getItem('accessToken')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const addToCart = async (productId) => {
    try {
      const res = await axios.post(`http://localhost:8000/api/v1/cart/add`, { productId }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      if (res.data.success) {
        toast.success('Product added to Cart')
        dispatch(setCart(res.data.cart))
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className='rounded-xl overflow-hidden h-max border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200'>

      {/* Image */}
      <div className='w-full aspect-square overflow-hidden bg-gray-50'>
        {loading
          ? <Skeleton className='w-full h-full rounded-none' />
          : <img
              onClick={() => navigate(`/products/${product._id}`)}
              src={productImg[0]?.url}
              alt={productName}
              className='w-full h-full object-cover transition-transform duration-300 hover:scale-105 cursor-pointer'
            />
        }
      </div>

      {/* Info */}
      {loading
        ? (
          <div className='px-3 space-y-2 my-3'>
            <Skeleton className='w-[90%] h-4' />
            <Skeleton className='w-[50%] h-4' />
            <Skeleton className='w-full h-8' />
          </div>
        )
        : (
          <div className='px-3 py-3 space-y-1'>
            <h1 className='font-semibold text-sm text-gray-800 h-10 line-clamp-2 leading-5'>{productName}</h1>
            <h2 className='font-bold text-gray-900 text-sm'>₹{productPrice}</h2>
            <button
              onClick={() => addToCart(product._id)}
              style={{
                width: '100%',
                marginTop: '8px',
                padding: '8px 0',
                background: '#16a34a',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#15803d'}
              onMouseLeave={e => e.currentTarget.style.background = '#16a34a'}
            >
              <ShoppingCart size={15} />
              Add to cart
            </button>
          </div>
        )
      }
    </div>
  )
}

export default ProductCard
