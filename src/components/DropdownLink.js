import Link from 'next/link'
import { Menu } from '@headlessui/react'

const DropdownLink = ({ children, ...props }) => (
    <Menu.Item>
        {({ active }) => (
            <Link
                {...props}
                className={`w-full text-left block px-4 py-2 text-sm leading-5 text-gray-700 ${
                    active ? 'bg-gray-100' : ''
                } focus:outline-none transition duration-150 ease-in-out`}>
                {children}
            </Link>
        )}
    </Menu.Item>
)

export const DropdownButton = ({ children, ...props }) => (
    <Menu.Item>
        {({ active }) => (
            <button
                className={`w-full text-left block px-4 py-2 text-sm leading-5 text-gray-700 ${
                    active ? 'bg-gray-100' : ''
                } focus:outline-none transition duration-150 ease-in-out`}
                {...props}>
                {children}
            </button>
        )}
    </Menu.Item>
)

export const DropdownNotification = ({ children, ...props }) => (
    <Menu.Item>
        {({ active }) => (
            <button
                className={`w-full text-left block px-4 py-2 text-sm leading-5 text-gray-700 ${
                    active ? 'bg-gray-100' : ''
                } focus:outline-none transition duration-150 ease-in-out`}
                {...props}>
                {children}
            </button>
        )}
    </Menu.Item>
)

export const DropdownExport = ({ children, ...props }) => (
    <Menu.Item>
        {({ active }) => (
            <button className={`w-full text-left block px-4 py-1 font-medium text-xs leading-5 text-gray-500 ${
                active ? 'bg-gray-100' : ''
            } focus:outline-none transition duration-150 ease-in-out`}
            {...props}>
                {children}
            </button>
        )}
    </Menu.Item>
)

export const DropdownMenu = ({ children, ...props }) => {
    <Menu.Item>
        {({ active }) => (
            <button className={`w-full text-left block px-4 py-2 text-sm leading-5 text-gray-700 ${
                active ? 'bg-gray-100' : ''
            } focus:outline-none transition duration-150 ease-in-out`}
            {...props}>
                {children}
            </button>
        )}
    </Menu.Item>
}

export const DropdownRowMenu = ({ children, ...props }) => {
    <Menu.Item>
        {({ active }) => (
            <button className={`w-full text-left block px-4 py-2 text-sm leading-5 text-gray-700 ${
                active ? 'bg-gray-100' : ''
            } focus:outline-none transition duration-150 ease-in-out z-50`}
            {...props}>
                {children}
            </button>
        )}
    </Menu.Item>
}

export default DropdownLink