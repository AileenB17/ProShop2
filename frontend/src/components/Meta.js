import React from 'react'
import { Helmet } from 'react-helmet'

export const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  )
}

Meta.defaultProps = {
  title: 'ProShop',
  description: 'We sell authentic imported products',
  keywords: 'electronics, imported products, authentic, ecommerce',
}
