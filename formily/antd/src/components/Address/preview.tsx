import React from 'react'
import { Cascader } from '@formily/antd-v5'
import { createBehavior, createResource } from '@pind/designable-core'
import { DnFC } from '@pind/designable-react'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'
import { cascaderOptions } from '../../data/AddressOptions'

const AddressComponent: React.FC<any> = (props) => {
	const options = props.options && Array.isArray(props.options) && props.options.length > 0 ? props.options : cascaderOptions
	return <Cascader {...props} options={options} />
}

export const Address: DnFC<React.ComponentProps<typeof Cascader>> = AddressComponent

Address.Behavior = createBehavior({
	name: 'Address',
	extends: ['Field'],
	selector: (node) => node.props['x-component'] === 'Address',
	designerProps: {
		propsSchema: createFieldSchema(AllSchemas.Cascader),
	},
	designerLocales: AllLocales.Address,
})

Address.Resource = createResource('Business', {
	icon: 'InputSource',
	elements: [
		{
			componentName: 'Field',
			props: {
				name: 'address',
				type: 'array',
				title: '地址',
				'x-decorator': 'FormItem',
				'x-component': 'Address',
			},
		},
	],
})
