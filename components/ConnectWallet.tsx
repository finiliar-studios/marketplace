import { FC } from 'react'
import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  Address,
} from 'wagmi'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import Link from 'next/link'
import { HiOutlineLogout } from 'react-icons/hi'
import FormatNativeCrypto from './FormatNativeCrypto'
import ConnectWalletButton from 'components/ConnectWalletButton'
import useMounted from 'hooks/useMounted'
import Avatar from './Avatar'
import { truncateAddress, truncateEns } from 'lib/truncateText'

const DARK_MODE = process.env.NEXT_PUBLIC_DARK_MODE
const DISABLE_POWERED_BY_RESERVOIR =
  process.env.NEXT_PUBLIC_DISABLE_POWERED_BY_RESERVOIR

const ConnectWallet: FC = () => {
  const account = useAccount()
  const { data: ensAvatar } = useEnsAvatar({ address: account?.address })
  const { data: ensName } = useEnsName({ address: account?.address })
  const { connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const wallet = connectors[0]
  const isMounted = useMounted()

  if (!isMounted) {
    return null
  }

  if (!account.isConnected)
    return (
      <ConnectWalletButton className="rounded-full bg-primary-675 px-[5px] p-[5px] flex items-center space-x-2 border border-primary-900">
        <>
          <img src="https://cdn.finiliar.com/website/fini-face.png" alt="Face Icon" className="rounded-full h-[30px] border border-primary-680" />
          <span className="text-primary-900 font-bold uppercase text-sm pr-1">Connect</span>
        </>
      </ConnectWalletButton>
    )

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="btn-primary-outline ml-auto rounded-full border-transparent p-0 normal-case dark:border-neutral-600 dark:bg-neutral-900 dark:ring-primary-900 dark:focus:ring-4">
        <Avatar address={account.address} avatar={ensAvatar} size={40} />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content align="end" sideOffset={6}>
        <div
          className={`w-48 space-y-1  bg-white px-1.5 py-2 shadow-md radix-side-bottom:animate-slide-down dark:bg-neutral-900 md:w-56 ${
            DISABLE_POWERED_BY_RESERVOIR ? 'rounded' : 'rounded-t'
          }`}
        >
          <div className="group flex w-full items-center justify-between rounded px-4 py-3 outline-none transition">
            {ensName ? (
              <span>{truncateEns(ensName)}</span>
            ) : (
              <span>{truncateAddress(account.address || '')}</span>
            )}
          </div>
          {/* <div className="group flex w-full items-center justify-between rounded px-4 py-3 outline-none transition">
            <span>Balance </span>
            <span>
              {account.address && <Balance address={account.address} />}
            </span>
          </div> */}
          <Link href={`/address/${account.address}`} legacyBehavior={true}>
            <DropdownMenu.Item asChild>
              <a className="group flex w-full cursor-pointer items-center justify-between rounded px-4 py-3 outline-none transition hover:bg-primary-200 focus:bg-neutral-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                My finis
              </a>
            </DropdownMenu.Item>
          </Link>
          <DropdownMenu.Item asChild>
            <button
              key={wallet.id}
              onClick={() => {
                disconnect()
              }}
              className="group flex w-full cursor-pointer items-center justify-between gap-3 rounded px-4 py-3 outline-none transition hover:bg-primary-200 focus:bg-neutral-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            >
              <span>Disconnect</span>
              {/* <img
                src="/icons/MoonSleep.svg"
                alt="Moon Sleep Icon"
                className="h-5 w-5"
              /> */}
            </button>
          </DropdownMenu.Item>
        </div>
        {!DISABLE_POWERED_BY_RESERVOIR && (
          <div className="group mx-auto flex w-full cursor-pointer items-center justify-center gap-3 rounded-b-2xl bg-neutral-100  py-4 px-4 outline-none  transition dark:bg-neutral-800 ">
            <Link href="https://reservoirprotocol.github.io/" legacyBehavior={true}>
              <a
                className="reservoir-tiny flex gap-2 dark:text-white"
                target="_blank"
              >
                Powered by{' '}
                <img
                  src={
                    !!DARK_MODE
                      ? `/reservoir_watermark_dark.svg`
                      : `/reservoir_watermark_light.svg`
                  }
                />
              </a>
            </Link>
          </div>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default ConnectWallet

type Props = {
  address: string
}

export const Balance: FC<Props> = ({ address }) => {
  const { data: balance } = useBalance({ address: address as Address })
  return <FormatNativeCrypto amount={balance?.value} />
}
