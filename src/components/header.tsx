import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

function Header() {

  const cities = [
    "Tokyo, Japan",
    "Austin, TX, USA",
    "Barcelona, Spain",
    "Melbourne, Australia",
    "Cape Town, South Africa",
    "Toronto, Canada",
    "Munich, Germany",
    "Buenos Aires, Argentina",
    "Seattle, WA, USA",
    "Singapore",
  ]
  
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
          <Combobox items={cities}>
              <ComboboxInput type="text" placeholder="What?" showTrigger={false} className='bg-white' />
              <ComboboxContent>
                <ComboboxEmpty>No cities found.</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item} value={item}>{item}</ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
        </Field>
        <Field>
          <FieldLabel>Looking for</FieldLabel>
          <Input type="text" placeholder="Parks, coffee, museums..." className='bg-white' />
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
