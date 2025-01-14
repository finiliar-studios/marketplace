import Link from 'next/link'
import { optimizeImage } from 'lib/optmizeImage'
import { FaShoppingCart } from 'react-icons/fa'
import React, {
  ComponentPropsWithoutRef,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import FormatCrypto from 'components/FormatCrypto'
import BuyNow from 'components/BuyNow'
import useTokens from 'hooks/useTokens'
import { useRecoilState, useRecoilValue } from 'recoil'
import { getCartCurrency, getTokensMap } from 'recoil/cart'
import { useAccount, useNetwork, useSigner } from 'wagmi'
import recoilCartTokens, { getPricingPools } from 'recoil/cart'
import { ListModal, useReservoirClient } from '@reservoir0x/reservoir-kit-ui'
import { setToast } from './token/setToast'
import { MutatorCallback } from 'swr'
import { useMediaQuery } from '@react-hookz/web'
import * as Tooltip from '@radix-ui/react-tooltip'
import RarityTooltip from './RarityTooltip'
import { Collection } from 'types/reservoir'
import { fetchMetaFromFiniliar, FiniliarMetadata } from 'lib/fetchFromFiniliar'
import getAttributeFromFreshData from 'lib/getAttributeFromFreshData'
import getShorthandFrequencyFromFreq from 'lib/getShorthandFrequencyFromTokenDetails'
import shortenFrequencyText from 'lib/shortenFrequencyText'
import tinycolor from 'tinycolor2'
import { finiliar } from 'colors'
import { getPricing } from 'lib/token/pricing'
import HeartButton from './HeartButton'
import { Delta } from './Delta'

const SOURCE_ICON = process.env.NEXT_PUBLIC_SOURCE_ICON
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID
const API_BASE =
  process.env.NEXT_PUBLIC_RESERVOIR_API_BASE || 'https://api.reservoir.tools'
const CURRENCIES = process.env.NEXT_PUBLIC_LISTING_CURRENCIES

type ListingCurrencies = ComponentPropsWithoutRef<
  typeof ListModal
>['currencies']
let listingCurrencies: ListingCurrencies = undefined

if (CURRENCIES) {
  listingCurrencies = JSON.parse(CURRENCIES)
}

type Props = {
  token?: ReturnType<typeof useTokens>['tokens']['data'][0]
  collectionImage: string | undefined
  collectionSize?: number | undefined
  collectionAttributes?: Collection['attributes']
  mutate: MutatorCallback
  setClearCartOpen?: Dispatch<SetStateAction<boolean>>
  setCartToSwap?: Dispatch<SetStateAction<any | undefined>>
  finiliarImage?: string,
}

const TokenCard: FC<Props> = ({
  token,
  collectionImage,
  collectionSize,
  collectionAttributes,
  mutate,
  setClearCartOpen,
  setCartToSwap,
}) => {
  const account = useAccount()
  const { data: signer } = useSigner()
  const { chain: activeChain } = useNetwork()
  const [ freshData, updateFreshData ] = useState<FiniliarMetadata>()

  const tokensMap = useRecoilValue(getTokensMap)
  const cartCurrency = useRecoilValue(getCartCurrency)
  const [cartTokens, setCartTokens] = useRecoilState(recoilCartTokens)
  const cartPools = useRecoilValue(getPricingPools)

  const reservoirClient = useReservoirClient()
  const singleColumnBreakpoint = useMediaQuery('(max-width: 640px)')

  const finiId = token?.token?.tokenId!
  useEffect(() => {
    if (token) {
      fetchMetaFromFiniliar(finiId).then((res) => {
        updateFreshData({
          latestPrice: res.latestPrice,
          latestDelta: res.latestDelta,
          image: res.image,
          background: res.background,
          attributes: res.attributes,
          threeDModel: res.threeDModel
        })
      }).catch((err) => {
        console.log(`Error fetching data for token id ${finiId}:`, err)
      })
    }
  }, [finiId])

  if (!token) return null
  if (!CHAIN_ID) return null
  const isInTheWrongNetwork = Boolean(signer && activeChain?.id !== +CHAIN_ID)
  const tokenId = `${token?.token?.contract}:${token?.token?.tokenId}`

  const isInCart = Boolean(tokensMap[tokenId])
  const isOwner =
    token?.token?.owner?.toLowerCase() === account?.address?.toLowerCase()
  const imageSize = singleColumnBreakpoint ? 533 : 250

  let price = getPricing(cartPools, token)
  let canAddToCart = true

  if (!price && token?.market?.floorAsk?.dynamicPricing?.data?.pool) {
    canAddToCart = false
  }

  const brightness = tinycolor(freshData?.background).getBrightness()
  let textColor 
  
  if (brightness > 50 && brightness < 200) textColor = tinycolor(freshData?.background).darken(15).toString()
  if (brightness >= 200) textColor = tinycolor(freshData?.background).darken(45).toString()
  if (brightness <= 50) textColor = tinycolor(freshData?.background).lighten(75).toString()


  const supportForLegacyCDN = (imageLink: String) => {
    if (!imageLink) {
      return imageLink
    }
    if (imageLink.includes("ipfs")) {
      return imageLink.replace(/\.gif/, ".mp4")
    } else {
      return imageLink + "?format=mp4"
    }

  }

  return (
    <div
      key={`${token?.token?.contract}${token?.token?.tokenId}`}
      className="hoverTrigger group relative mb-6 grid transform-gpu self-start overflow-hidden rounded-[16px] bg-primary-200 transition ease-in hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-lg hover:ease-out dark:border-0 dark:bg-neutral-800 dark:ring-1 dark:ring-neutral-600"
    >
      {isInCart ? (
        <div className="absolute top-4 right-4 z-10 flex h-[34px] w-[34px] animate-slide-down items-center justify-center overflow-hidden rounded-full bg-primary-700">
          <FaShoppingCart className="h-[18px] w-[18px] text-white" />
        </div>
      ) : null}

      {freshData?.latestDelta &&
          <div className="hoverTarget md:hidden absolute flex justify-between top-[10px] left-[10px] right-[10px] z-[9] text-sm rounded-[16px]">
              <div className="rounded-full bg-[#ffffffa8] p-1 px-2 inline-flex items-center">
                {/* <img src={icon} className="h-[14px] mr-2" alt="Currency icon" />
                <span>${freshData?.latestPrice.toFixed(2)}</span> */}
                <Delta delta={freshData?.latestDelta!} tokenData={freshData!} useDefaultColors={true} />
              </div>
            
            <div className="inline-flex items-center">
              {/* <div className="rounded-full bg-primary-100/[.65] py-[2px] px-2" style={{ color: textColor }}>
                {shortenFrequencyText(getAttributeFromFreshData(freshData?.attributes, 'Frequency'))}
              </div> */}
              {/* <HeartButton tokenId={finiId} /> */}
            </div>
          </div>
        }
      <Link
        legacyBehavior={true}
        key={`${token?.token?.contract}:${token?.token?.tokenId}`}
        href={`/discover/${token?.token?.tokenId}`}
      >
        <a className="mb-[88px] md:mb-[48px] hoverTrigger">
          {freshData?.image ? (
            <div>
              <span className="block pb-[100%]" />
              <video loop autoPlay muted playsInline className="object-cover w-full absolute top-0">
                <source src={supportForLegacyCDN(freshData?.image)} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div className="relative w-full">
              <div className="absolute inset-0 grid place-items-center backdrop-blur-lg">
                <div>
                  <img
                    src={optimizeImage(collectionImage, imageSize)}
                    alt={`${token?.token?.collection?.name}`}
                    className="mx-auto mb-4 h-16 w-16 overflow-hidden rounded-full border-2 border-white"
                    width="64"
                    height="64"
                  />
                </div>
              </div>
              <img
                src={optimizeImage(collectionImage, imageSize)}
                alt={`${token?.token?.collection?.name}`}
                className="aspect-square w-full object-cover"
                width="250"
                height="250"
              />
            </div>
          )}
        </a>
      </Link>
      <div
        className={`absolute bottom-[0px] w-full transition-all  dark:bg-neutral-800 md:-bottom-[41px] ${
          !isOwner && !token?.market?.floorAsk?.price
            ? ''
            : 'group-hover:bottom-[0px]'
        }`}
      >
        {/* <div
          className="reservoir-subtitle mb-3 overflow-hidden truncate px-4 pt-4 dark:text-white lg:pt-3"
          title={token?.token?.name || token?.token?.tokenId}
        >
          {token?.token?.name || `#${token?.token?.tokenId}`}
        </div> */}
        <div className="flex justify-between px-4 p-3 lg:pb-3 bg-primary-200">
          {token?.token?.name ? token?.token?.name.replace('finiliar', 'fini') : `#${token?.token?.tokenId}`}
          {token?.market?.floorAsk?.price?.amount?.decimal != null &&
          token?.market?.floorAsk?.price?.amount?.decimal != undefined ? (
            <div className="flex items-center">
              <div className="reservoir-h6 mr-[10px] flex items-center">
                <FormatCrypto
                  amount={price?.amount?.decimal}
                  address={price?.currency?.contract}
                  decimals={price?.currency?.decimals}
                  maximumFractionDigits={4}
                />
              </div>
              <div className="text-right">
                {token?.market?.floorAsk?.source && (
                  <img
                    className="h-5 w-5"
                    src={
                      reservoirClient?.source &&
                      reservoirClient.source ===
                        token.market.floorAsk.source.domain &&
                      SOURCE_ICON
                        ? SOURCE_ICON
                        : `${API_BASE}/redirect/sources/${token?.market.floorAsk.source.domain}/logo/v2`
                    }
                    alt=""
                  />
                )}
              </div>
            </div>
          ) : !isOwner ? (
            <div className="h-[64px]"></div>
          ) : (
            <div className="h-6"></div>
          )}
        </div>
        {isOwner && (
          <div className="grid">
            <ListModal
              trigger={
                <button className="btn-primary-fill bg-primary-500 !rounded-none reservoir-subtitle flex h-[40px] items-center justify-center whitespace-nowrap rounded-none text-white focus:ring-0">
                  {token?.market?.floorAsk?.price?.amount?.decimal
                    ? 'Create New Listing'
                    : 'List for Sale'}
                </button>
              }
              collectionId={token?.token?.contract}
              tokenId={token?.token?.tokenId}
              currencies={listingCurrencies}
              onListingComplete={() => {
                mutate()
              }}
              onListingError={(err: any) => {
                if (err?.code === 4001) {
                  setToast({
                    kind: 'error',
                    message: 'You have canceled the transaction.',
                    title: 'User canceled transaction',
                  })
                  return
                }
                setToast({
                  kind: 'error',
                  message: 'The transaction was not completed.',
                  title: 'Could not list token',
                })
              }}
            />
          </div>
        )}
        {price?.amount?.decimal != null &&
          price?.amount?.decimal != undefined &&
          !isOwner && (
            <div
              className={`grid ${
                isInCart || canAddToCart ? 'grid-cols-2' : ''
              }`}
            >
              <BuyNow
                data={{
                  token,
                }}
                mutate={mutate}
                signer={signer}
                isInTheWrongNetwork={isInTheWrongNetwork}
                buttonClassName="bg-primary-500 text-primary-100 reservoir-subtitle flex h-[40px] items-center justify-center whitespace-nowrap focus:ring-0"
              />
              {isInCart && (
                <button
                  onClick={() => {
                    const newCartTokens = [...cartTokens]
                    const index = newCartTokens.findIndex(
                      (newCartToken) =>
                        newCartToken.token.contract ===
                          token?.token?.contract &&
                        newCartToken.token.tokenId === token?.token?.tokenId
                    )
                    newCartTokens.splice(index, 1)
                    setCartTokens(newCartTokens)
                  }}
                  className="reservoir-subtitle flex h-[40px] items-center justify-center background-primary-100 border-t-2 border-primary-400 text-primary-900 disabled:cursor-not-allowed dark:border-neutral-600 dark:text-red-300"
                >
                  Remove
                </button>
              )}
              {!isInCart && canAddToCart && (
                <button
                  disabled={isInTheWrongNetwork}
                  onClick={() => {
                    if (token && token.token && token.market) {
                      if (
                        !cartCurrency ||
                        price?.currency?.contract === cartCurrency?.contract
                      ) {
                        setCartTokens([
                          ...cartTokens,
                          {
                            token: token.token,
                            market: token.market,
                          },
                        ])
                      } else {
                        setCartToSwap &&
                          setCartToSwap([
                            {
                              token: token.token,
                              market: token.market,
                            },
                          ])
                        setClearCartOpen && setClearCartOpen(true)
                      }
                    }
                  }}
                  className="reservoir-subtitle flex h-[40px] items-center justify-center border-t border-neutral-300 disabled:cursor-not-allowed dark:border-neutral-600"
                >
                  Add to Cart
                </button>
              )}
            </div>
          )}
      </div>
    </div>
  )
}

export default TokenCard
