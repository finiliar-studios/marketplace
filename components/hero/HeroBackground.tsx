import { optimizeImage } from 'lib/optmizeImage'
import { FC, ReactNode } from 'react'

const envBannerImage = process.env.NEXT_PUBLIC_BANNER_IMAGE
const envBannerImageDisabled = process.env.NEXT_PUBLIC_DISABLE_COLLECTION_BG

type Props = {
  banner: string | undefined
  children: ReactNode
}

const HeroBackground: FC<Props> = ({ banner, children }) => {
  // NOTE: don't know why this isn't working in prod but temporarily disabling
  // const bannerImage = envBannerImageDisabled
  //   ? null
  //   : optimizeImage(envBannerImage || banner, 1500)
  const bannerImage = null

  const baseClasses = `relative z-0 px-[25px] flex flex-col items-center col-span-full w-full pb-3`

  return bannerImage ? (
    <div className={baseClasses}>
      {children}
      <div
        className="absolute inset-0 z-[-1] overflow-hidden"
        style={{ boxShadow: 'inset 0 0 200px #000000' }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${bannerImage})`,
            filter: 'blur(5px)',
          }}
        />
      </div>
      <div className="absolute inset-0 z-0 bg-backdrop dark:bg-dark-backdrop" />
    </div>
  ) : (
    <div className={`${baseClasses} bg-[#ffd9d3] dark:bg-black`}>{children}</div>
  )
}

export default HeroBackground
