import '@fontsource/roboto/300.css';  
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './globals.css'

import ReactQuery from '@/components/ReactQuery';
import CssBaseLineWrapper from '@/components/CssBaseLineWrapper';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */} 
      <head />
      <body>
        <ReactQuery>
          {children}
          <CssBaseLineWrapper />
        </ReactQuery>
      </body>
    </html>
  )
}
