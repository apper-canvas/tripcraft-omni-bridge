import Input from '../atoms/Input'
import Label from '../atoms/Label'

const FormField = ({ label, id, ...props }) => {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...props} />
    </div>
  )
}

export default FormField