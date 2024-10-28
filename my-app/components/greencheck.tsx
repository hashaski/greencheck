import Image from 'next/image'
import logo from '@/public/GREENCHECK_LOGO.png'

export default function GreenCheck() {
    return (<Image
        src={logo}
        alt="GreenCheck Logo"
        width={24}
        height={24}
        className="mt-1"
    />)
}