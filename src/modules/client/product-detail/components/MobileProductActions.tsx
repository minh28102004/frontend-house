'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import { FiShoppingCart } from 'react-icons/fi'
import { PiChatCircleDotsLight } from "react-icons/pi";
import { MdKeyboardArrowRight } from 'react-icons/md'
import { RiCheckboxCircleFill } from "react-icons/ri";

interface MobileProductActionsProps {
  productId: string
  productSlug: string
  productName: string
  productThumbnail?: string
  price: number
}

const MobileProductActions: React.FC<MobileProductActionsProps> = ({
  productId,
  productSlug,
  productName,
  productThumbnail,
  price,
}) => {
  const { addToCart, isLoading } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [isOpenModalAddToCart, setIsOpenModalAddToCart] = useState(false)
  const [isOpenModalSizeGuide, setIsOpenModalSizeGuide] = useState(false)
  const [isSelectedSize, setSelectedSize] = useState("L")
  const [showAddToCartToast, setShowAddToCartToast] = useState(false)
  const [isFlying, setIsFlying] = useState(false)
  const router = useRouter()
  const productImageRef = useRef<HTMLImageElement | null>(null)
  const flyImageRef = useRef<HTMLImageElement | null>(null)

  const sizes = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL']

  // Size Guide Data
  const sizeGuide = [
    { size: 'S', weight: { min: 50, max: 57 }, height: { min: 160, max: 168 } },
    { size: 'M', weight: { min: 58, max: 64 }, height: { min: 167, max: 173 } },
    { size: 'L', weight: { min: 65, max: 70 }, height: { min: 172, max: 176 } },
    { size: 'XL', weight: { min: 71, max: 77 }, height: { min: 175, max: 180 } },
    { size: '2XL', weight: { min: 78, max: 84 }, height: { min: 178, max: 183 } },
    { size: '3XL', weight: { min: 85, max: 92 }, height: { min: 180, max: 185 } },
    { size: '4XL', weight: { min: 93, max: 99 }, height: { min: 182, max: 187 } },
    { size: '5XL', weight: { min: 100, max: 106 }, height: { min: 183, max: 188 } },
  ]
  useEffect(() => {
    if (!showAddToCartToast) return

    const timer = setTimeout(() => {
      setShowAddToCartToast(false)
    }, 1800)

    return () => clearTimeout(timer)
  }, [showAddToCartToast])
  const handleOpenModal = () => {
    setIsOpenModalAddToCart(true)
  }

  const handleOpenModalSizeGuide = () => {
    setIsOpenModalSizeGuide(true)
  }

  const handleAddToCart = async () => {
    try {
      setIsAdding(true)
      await addToCart(productId, 1, {
        productSlug,
        productName,
        productThumbnail,
        size: isSelectedSize,
        price,
      })

      console.log('Đã thêm vào giỏ hàng!')
    } catch (e: any) {
      console.error(e?.message || 'Lỗi khi thêm vào giỏ hàng')
    } finally {
      setIsAdding(false)
    }
  }

  const handleAddToCartToast = async () => {
    try {
      setIsAdding(true)

      const fromEl = productImageRef.current
      const toEl = document.getElementById('cart-fly-target')

      if (!fromEl || !toEl) {
        await addToCart(productId, 1, {
          productSlug,
          productName,
          productThumbnail,
          size: isSelectedSize,
          price,
        })
        setShowAddToCartToast(true)
        return
      }

      const from = fromEl.getBoundingClientRect()
      const to = toEl.getBoundingClientRect()

      setIsFlying(true)

      requestAnimationFrame(() => {
        const flyEl = flyImageRef.current
        if (!flyEl) return

        // vị trí ban đầu
        flyEl.style.left = `${from.left}px`
        flyEl.style.top = `${from.top}px`
        flyEl.style.transform = 'translate(0,0) scale(1)'
        flyEl.style.transition = 'transform 700ms cubic-bezier(0.4,0,0.2,1)'

        requestAnimationFrame(() => {
          const fromCenterX = from.left + from.width / 2
          const fromCenterY = from.top + from.height / 2

          const toCenterX = to.left + to.width / 2
          const toCenterY = to.top + to.height / 2

          const x = toCenterX - fromCenterX + 16
          const y = toCenterY - fromCenterY + 20

          flyEl.style.transform = `translate(${x}px, ${y}px) scale(0.3)`
        })
      })

      await addToCart(productId, 1, {
        productSlug,
        productName,
        productThumbnail,
        size: isSelectedSize,
        price,
      })

      setTimeout(() => {
        setIsFlying(false)
        setShowAddToCartToast(true)
      }, 700)

    } catch (e) {
      setIsFlying(false)
      console.error(e)
    } finally {
      setIsAdding(false)
    }
  }

  const handleBuyNow = async () => {
    try {
      await handleAddToCart()
      router.push('/checkout')
    } catch {
      // lỗi đã được alert trong handleAddToCart
    }
  }

  return (
    <>
      {isFlying && productThumbnail && (
        <img
          ref={flyImageRef}
          src={productThumbnail}
          alt=""
          className="pointer-events-none fixed z-[200000] w-16 h-16 rounded-lg object-cover will-change-transform"
        />
      )}

      {showAddToCartToast && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center gap-2 rounded-[11px] bg-black/80 px-6 py-4 text-white shadow-lg">
            <RiCheckboxCircleFill className="text-3xl text-white" />
            <span className="text-sm font-medium">Đã thêm vào giỏ</span>
          </div>
        </div>
      )}

      {isOpenModalAddToCart && (
        <div
          className="fixed inset-0 z-[99999] flex items-end bg-black/40"
          onClick={() => setIsOpenModalAddToCart(false)} // click outside
        >
          {/* Bottom sheet */}
          <div
            className="w-full bg-white rounded-t-2xl p-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // chặn bubble
          >
            {/* Header */}
            <div className="flex gap-4">
              <img
                ref={productImageRef}
                src={productThumbnail}
                alt="product"
                className="w-24 h-24 object-cover rounded-lg border"
              />


              <div className="flex-1">
                <p className="text-red-500 text-lg font-semibold flex items-center h-full">
                  {price?.toLocaleString("vi-VN")}đ
                </p>
              </div>

              <button
                onClick={() => setIsOpenModalAddToCart(false)} // nút đóng
                className="text-gray-400 text-xl leading-none flex justify-end"
              >
                ×
              </button>
            </div>

            {/* Options */}
            <div className="mt-6 space-y-6">
              {/* Size */}
              <div>
                <div className="flex items-center justify-between">
                  <p className="font-medium mb-2">Size</p>
                  <button
                    onClick={handleOpenModalSizeGuide}
                    className="text-gray-400 text-xs flex items-center gap-1"
                  >
                    Hướng dẫn chọn kích cỡ
                    <MdKeyboardArrowRight />
                  </button>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={
                        `px-3 py-2 border rounded-md text-sm hover:border-black` +
                        (isSelectedSize === size
                          ? " border-black font-semibold"
                          : " border-gray-300")
                      }
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              {/* <div className="flex items-center justify-between">
                <p className="font-medium">Số lượng</p>
                <div className="flex items-center border rounded-md">
                  <button className="px-3 py-1">−</button>
                  <span className="px-4">1</span>
                  <button className="px-3 py-1">+</button>
                </div>
              </div> */}
            </div>

            {/* Action */}
            <div className="mt-6">
              <button
                onClick={handleAddToCartToast}
                className="w-full h-12 rounded-md bg-black text-white text-base font-medium"
              >
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>
      )}

      {isOpenModalSizeGuide && (
        <div
          className="fixed inset-0 z-[99999] bg-black/40 flex items-end"
          onClick={() => setIsOpenModalSizeGuide(false)} // click outside
        >
          <div
            className="w-full bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // chặn bubble
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b">
              <button
                className="text-xl"
                onClick={() => setIsOpenModalSizeGuide(false)} // nút đóng
              >
                ←
              </button>
              <h2 className="font-semibold text-base">
                Hướng dẫn chọn kích cỡ
              </h2>
            </div>

            {/* Product size */}
            <div className="px-4">
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-2 bg-gray-50 text-sm font-medium">
                  <div className="p-3">Size</div>
                  <div className="p-3 text-right">Chiều cao / Cân nặng</div>
                </div>

                {sizeGuide.map((item) => (
                  <div
                    key={item.size}
                    className="grid grid-cols-2 text-sm border-t"
                  >
                    <div className="p-3">{item.size}</div>
                    <div className="p-3 text-right text-gray-600">
                      {item.height.min}-{item.height.max}cm · {item.weight.min}-{item.weight.max}kg
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-400 mt-2">
                Số đo có thể thay đổi nhẹ
              </p>
            </div>

            <div className="h-6" />
          </div>
        </div>
      )}

      <div
        className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="h-14">
          <div className="grid h-full grid-cols-12">
            {/* Chat */}
            <a
              href="https://zalo.me/0901113179"
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-3 flex flex-col items-center justify-center border-r border-gray-200 text-gray-700"
            >
              <PiChatCircleDotsLight size={20} className="text-red-500" />
              <span className="mt-1 text-[10px]">Chat ngay</span>
            </a>

            {/* Add to cart */}
            <button
              type="button"
              onClick={handleOpenModal}
              disabled={isAdding || isLoading}
              className="col-span-3 flex flex-col items-center justify-center border-r border-gray-200 text-gray-700 disabled:opacity-50"
            >
              <FiShoppingCart size={20} className="text-red-500" />
              <span className="mt-1 text-[10px]">Thêm vào Giỏ hàng</span>
            </button>

            {/* Buy now */}
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={isAdding || isLoading}
              className="col-span-6 flex flex-col items-center justify-center bg-[#d20505] text-white disabled:opacity-50"
            >
              <span className="text-[13px] font-medium">Mua với Voucher</span>
              <span className="text-[15px] font-bold">
                {price?.toLocaleString("vi-VN")}đ
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default MobileProductActions
