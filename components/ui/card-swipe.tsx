"use client"

import React from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css/effect-cards"
import { EffectCards } from "swiper/modules"
import "swiper/css"
import { Autoplay, Navigation, Pagination } from "swiper/modules"

interface CardSwipeProps {
  cards: {
    cardholder_name: string
    card_number: string
    expiry_date: string
    card_type: string
    status: string
    account_no: string
  }[]
  autoplayDelay?: number
  slideShadows?: boolean
}

export const CardSwipe: React.FC<CardSwipeProps> = ({
  cards,
  autoplayDelay = 1500,
  slideShadows = false,
}) => {
  const css = `
    .swiper {
      width: 100%;
    }
    .swiper-slide {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 18px;
      font-size: 22px;
      font-weight: bold;
      color: #fff;
    }
  `
  return (
    <section>
      <style>{css}</style>
      <Swiper
        autoplay={{
          delay: autoplayDelay,
          disableOnInteraction: false,
        }}
        effect={"cards"}
        grabCursor={true}
        loop={true}
        slidesPerView={"auto"}
        rewind={true}
        cardsEffect={{
          slideShadows: slideShadows,
        }}
        modules={[EffectCards, Autoplay, Pagination, Navigation]}
      >
        {cards.map((card, index) => (
          <SwiperSlide key={card.card_number + index}>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 w-80 h-48 flex flex-col justify-between shadow-lg">
              <div className="flex justify-between items-center">
                <span className=" text-sm">
                  {card.card_type.toUpperCase()}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    card.status === "active"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {card.status}
                </span>
              </div>
              <div className="mt-2 mb-2 font-mono text-lg tracking-widest">
                {card.card_number.replace(/(\d{4})/g, "$1 ")}
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-xs text-gray-200">Cardholder</div>
                  <div className="font-semibold text-sm">{card.cardholder_name}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-200">Expiry</div>
                    <div className="text-sm font-semibold">
                    {(() => {
                      const date = new Date(card.expiry_date)
                      const formatted = `${(date.getMonth() + 1)
                      .toString()
                      .padStart(2, "0")}/${date
                      .getDate()
                      .toString()
                      .padStart(2, "0")}`
                      return formatted
                    })()}
                    </div>
                </div>
              </div>
              <div className="text-xs text-gray-300 mt-2">
                Account: {card.account_no}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
