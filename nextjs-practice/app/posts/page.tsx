import Posts from '@/components/Posts/Posts';

async function page(props : any) {
  await fetch('http://localhost:5000', { cache: 'no-store' });

  return (
    <Posts />
  )
}

export default page;