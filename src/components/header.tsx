import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

function Header() {
  return (
    <div className='flex items-center justify-between bg-gray-200 p-5'>
     <div className='flex items-center gap-2'>
      <h1 className='text-2xl font-bold'>Place Finder</h1>
     </div>
     <form className='w-full max-w-3xl'>
      <FieldGroup>
        <div className='grid grid-cols-[1fr_1fr_auto] gap-4 items-end'>
        <Field>
          <FieldLabel>Location</FieldLabel>
          <Input type="text" placeholder="Where?" className='bg-white' />
        </Field>
        <Field>
          <FieldLabel>Place</FieldLabel>
            <Input type="text" placeholder="What?" className='bg-white' />
        </Field>
        <Button type="submit" size="lg">Search</Button>
        </div>
      </FieldGroup>
     </form>

     <div className='flex items-center gap-2'>
      <h1>About</h1>
     </div>
    </div>
  )
}

export default Header
