import {AbiItem} from "@/units"
import {Form, Input} from "antd"
import {FC, MutableRefObject, useImperativeHandle, useState} from "react";

export type OperationFormInteraction = { getInputs: (funcName: string) => Promise<object> };

interface OperationFormProps {
  abi: AbiItem,
  event?: MutableRefObject<OperationFormInteraction>
}

const Label = ({name, type}: { name: string, type: string }) => {
  return (
    <>
      {name}
      <span>({type})</span>
    </>
  )
}

const OperationForm: FC<OperationFormProps> = ({event, abi}) => {
  const [form] = Form.useForm();

  useImperativeHandle(event, () => {
    return {
      getInputs: async (funcName) => {
        console.log("Abi name: ", abi.name)
        return await form.validateFields()
      }
    }
  });

  return (
    <Form style={{}} form={form} labelAlign={"left"}>
      {
        abi.inputs.map((value, index) => {
          return (
            <Form.Item
              style={{
                borderBottom: '1px solid #0000001F',
                marginLeft: '20px',
                marginBottom: 0,
                height: '50px',
                alignContent: 'center'
              }}
              rules={[{required: true}]}
              name={value.name}
              label={<Label name={value.name} type={value.type}/>}
              key={`${value.name}_${index}`}>
              <Input required variant='borderless' placeholder={`Please Input ${value.name}`}/>
            </Form.Item>
          )
        })
      }
    </Form>
  )
}

export default OperationForm;