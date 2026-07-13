import Image from 'next/image'
import Link from 'next/link'
import ProducCart from './componants/ProducCart'
import Views from './componants/Views'

export default function Home() {
  return (
  <main>
    <h1>Hello World</h1>
    <Link href='/users'>Users </Link>
    <ProducCart></ProducCart>
    <Views></Views>
  </main>
  )
}
