import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

function Header() {
  return (
    <div className='flex items-center justify-between bg-gray-200 p-5'>
     <div className='flex items-center gap-2'>
      <h1 className='text-2xl font-bold'>Place Finder</h1>
     </div>
     <InputGroup className='max-w-sm bg-white'>
        <InputGroupInput placeholder="Location + place, e.g. Las Vegas Matcha" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton variant="default">Search</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
     <div className='flex items-center gap-2'>
      <h1>About</h1>
     </div>
    </div>
  )
}

export default Header
