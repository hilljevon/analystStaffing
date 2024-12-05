"use client"
import React from 'react'

const ErrorPage = () => {
    return (
        <div className='relative hidden flex-col min-w-max items-start gap-4 md:flex mt-12'>
            <h1>Oh no!</h1>
            <p>There was an error retrieving data. Please refer to console for more details.</p>
        </div>
    )
}

export default ErrorPage