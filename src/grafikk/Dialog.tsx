import React from 'react'

export const dialog = (
    <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            <circle id="a" cx="32" cy="32" r="32" />
        </defs>
        <g fill="none" fillRule="evenodd">
            <mask id="b" fill="#fff">
                <use xlinkHref="#a" />
            </mask>
            <g mask="url(#b)" fill="#C2EAF7">
                <path d="M0 64h64V0H0z" />
            </g>
            <g>
                <path
                    d="M31.542 19.068h22.151c.708 0 1.283.674 1.283 1.505v13.18c0 .833-.575 1.507-1.283 1.507h-7.789v6.223l-6.822-6.223h-7.54c-.708 0-1.282-.674-1.282-1.506V20.573c0-.83.574-1.505 1.282-1.505"
                    fill="#FFF"
                />
                <path
                    d="M32.441 23.022H10.207c-.645 0-1.168.55-1.168 1.227v14.577c0 .678.523 1.226 1.168 1.226h7.028v5.067l6.207-5.067h9c.644 0 1.167-.548 1.167-1.226V24.25c0-.678-.523-1.227-1.168-1.227"
                    fill="#624B7F"
                />
            </g>
        </g>
    </svg>
)
