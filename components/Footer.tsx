import { FaTwitter, FaDiscord } from 'react-icons/fa'
import Link from 'next/link'

const FOOTER_ENABLED = true
const COLLECTION = process.env.NEXT_PUBLIC_COLLECTION

const Footer = () => {
  if (FOOTER_ENABLED)
    return (
      <footer className='text-primary-900 col-span-full flex flex-col sm:flex-row justify-between items-center px-6 md:px-16 pb-12'>
        <div className='flex flex-row justify-between items-center gap-x-6 sm:gap-x-8 mb-6 sm:mb-0 text-xs sm:text-sm flex-wrap'>
          © 2022 finiliar studios, ltd.
        </div>
        <div className='flex flex-row flex-wrap items-center gap-6'>
          <Link href='/discover'>
            [ Discover ]
          </Link>
          <Link href='https://finiliar.mirror.xyz/' legacyBehavior={true}>
            <a className="flex-none dark:text-white" target="_blank" rel="noopener noreferrer">
              [ Blog ]
            </a>
          </Link>
          <Link href='https://etherscan.io/address/0x5a0121a0a21232ec0d024dab9017314509026480' legacyBehavior={true}>
            <a className="flex-none dark:text-white" target="_blank" rel="noopener noreferrer">
              {/* <img src='/icons/etherscan-logo-circle.svg' alt="Etherscan Icon" className="h-[22px]" /> */}
              [ Etherscan ]
            </a>
          </Link>
          <Link href='https://nftstorage.link/ipfs/bafkreiddyrny25yijyqpayekam6z2soysblv7bpj3wawngjd4cftbfco7i' className='ml-5' legacyBehavior={true}>
            <a className='' target="_blank" rel="noreferrer">
              [ Finiliar License ]
            </a>
          </Link>
          <Link href='https://twitter.com/finiliar' legacyBehavior={true}>
            <a className='' target="_blank" rel="noreferrer">
              <FaTwitter className='h-[20px] w-[25px]' />
            </a>
          </Link>
          <Link href='https://discord.gg/finidotworld' className='ml-5' legacyBehavior={true}>
            <a className='' target="_blank" rel="noreferrer">
              <FaDiscord className='h-[19px] w-[25px]' />
            </a>
          </Link>
          
        </div>
      </footer>
    )

  return null
}

export default Footer
