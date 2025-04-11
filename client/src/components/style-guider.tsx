import { useState } from 'react';
import { ModeToggle } from '@/components/mode-toggle'
import icon from '/icon.svg'

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';

const StyleGuider = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dropdownChecked1, setDropdownChecked1] = useState(true);
  const [dropdownChecked2, setDropdownChecked2] = useState(false);
  const [dropdownRadioValue, setDropdownRadioValue] = useState('bottom');
  const [checkboxChecked, setCheckboxChecked] = useState<boolean | 'indeterminate'>(false);
  const [randomNumber, setRandomNumber] = useState<number | null>(0);

  const invoices = [
    {
      invoice: 'INV001',
      paymentStatus: 'Paid',
      totalAmount: '$250.00',
      paymentMethod: 'Credit Card',
    },
    {
      invoice: 'INV002',
      paymentStatus: 'Pending',
      totalAmount: '$150.00',
      paymentMethod: 'PayPal',
    },
    {
      invoice: 'INV003',
      paymentStatus: 'Unpaid',
      totalAmount: '$350.00',
      paymentMethod: 'Bank Transfer',
    },
  ];

  const fetchRandomNumber = async () => {
    try {
      const response = await fetch('/api/v1/random-number');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRandomNumber(data.randomNumber);
    } catch (error) {
      console.error('Error fetching random number:', error);
    }
  };

  return (
    <div className="p-8 pt-4">
      <div className="flex flex-row items-center">
        <ModeToggle/>
        <img src={icon} alt="icon" />
        <Button onClick={fetchRandomNumber} variant="outline" className="ml-4w">
          Get random number from server
        </Button>
        <Label className="ml-4 w-10">{randomNumber}</Label>
        <h1 className="text-3xl font-bold mb-8 pl-80">UI Component Showcase</h1>
      </div>
      {/* Multi-column container for the component sections */}
      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
        {/* Button */}
        <section className="break-inside-avoid mb-6">
          <h2 className="text-2xl font-semibold mb-4">Button</h2>
          <div className="flex flex-wrap gap-4">
            <Button>Default</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button disabled>Disabled</Button>
          </div>
        </section>

        {/* Card */}
        <section className="break-inside-avoid mb-6">
          <h2 className="text-2xl font-semibold mb-4">Card</h2>
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Create project</CardTitle>
              <CardDescription>Deploy your new project in one-click.</CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Name of your project" />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Deploy</Button>
            </CardFooter>
          </Card>
        </section>

        {/* Checkbox */}
        <section className="break-inside-avoid mb-6">
          <h2 className="text-2xl font-semibold mb-4">Checkbox</h2>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms1"
              checked={checkboxChecked}
              onCheckedChange={setCheckboxChecked}
            />
            <Label htmlFor="terms1">Accept terms and conditions</Label>
          </div>
           <div className="flex items-center space-x-2 mt-2">
            <Checkbox id="terms2" checked={true}/>
            <Label htmlFor="terms2">Checked</Label>
          </div>
           <div className="flex items-center space-x-2 mt-2">
            <Checkbox id="terms3" checked="indeterminate"/>
            <Label htmlFor="terms3">Indeterminate</Label>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <Checkbox id="terms4" disabled/>
            <Label htmlFor="terms4">Disabled</Label>
          </div>
        </section>

        {/* Command */}
        <section className="break-inside-avoid mb-6">
          <h2 className="text-2xl font-semibold mb-4">Command</h2>
          <Command className="rounded-lg border shadow-md w-[300px]">
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem>Calendar</CommandItem>
                <CommandItem>Search Emoji</CommandItem>
                <CommandItem>Calculator</CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Settings">
                <CommandItem>Profile</CommandItem>
                <CommandItem>Billing</CommandItem>
                <CommandItem>Settings</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </section>

        {/* Dialog */}
        <section className="break-inside-avoid mb-6">
          <h2 className="text-2xl font-semibold mb-4">Dialog</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Edit Profile</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" value="discjenny" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username
                  </Label>
                  <Input id="username" value="@discjenny" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                   <Button type="submit">Save changes</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>

        {/* Dropdown Menu */}
        <section className="break-inside-avoid mb-6">
          <h2 className="text-2xl font-semibold mb-4">Dropdown Menu</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Open Menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Keyboard shortcuts</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>Email</DropdownMenuItem>
                      <DropdownMenuItem>Message</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>More...</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem>
                  New Team
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>GitHub</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuItem disabled>API</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={dropdownChecked1}
                onCheckedChange={setDropdownChecked1}
              >
                Status Bar
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={dropdownChecked2}
                onCheckedChange={setDropdownChecked2}
                disabled
              >
                Activity Bar
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={dropdownRadioValue} onValueChange={setDropdownRadioValue}>
                <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
               <DropdownMenuSeparator />
               <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </section>

        {/* Input */}
        <section className="break-inside-avoid mb-6">
          <h2 className="text-2xl font-semibold mb-4">Input</h2>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email-input">Email</Label>
            <Input type="email" id="email-input" placeholder="Email" />
          </div>
           <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
            <Label htmlFor="disabled-input">Disabled</Label>
            <Input type="text" id="disabled-input" placeholder="Disabled" disabled />
          </div>
        </section>

        {/* Label */}
        <section className="break-inside-avoid mb-6">
          <h2 className="text-2xl font-semibold mb-4">Label</h2>
          <div className="flex items-center space-x-2">
             <Checkbox id="label-checkbox" />
             <Label htmlFor="label-checkbox">This is a label</Label>
          </div>
        </section>

        {/* Popover */}
        <section className="break-inside-avoid mb-6">
          <h2 className="text-2xl font-semibold mb-4">Popover</h2>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Open popover</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Dimensions</h4>
                  <p className="text-sm text-muted-foreground">
                    Set the dimensions for the layer.
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="width">Width</Label>
                    <Input
                      id="width"
                      defaultValue="100%"
                      className="col-span-2 h-8"
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="maxWidth">Max. width</Label>
                    <Input
                      id="maxWidth"
                      defaultValue="300px"
                      className="col-span-2 h-8"
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="height">Height</Label>
                    <Input
                      id="height"
                      defaultValue="25px"
                      className="col-span-2 h-8"
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="maxHeight">Max. height</Label>
                    <Input
                      id="maxHeight"
                      defaultValue="none"
                      className="col-span-2 h-8"
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </section>

        {/* Select */}
        <section className="break-inside-avoid mb-6">
          <h2 className="text-2xl font-semibold mb-4">Select</h2>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fruits</SelectLabel>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Vegetables</SelectLabel>
                <SelectItem value="aubergine">Aubergine</SelectItem>
                <SelectItem value="broccoli">Broccoli</SelectItem>
                <SelectItem value="carrot" disabled>
                  Carrot
                </SelectItem>
                <SelectItem value="courgette">Courgette</SelectItem>
                <SelectItem value="leek">Leek</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </section>

        {/* Table */}
        <section className="break-inside-avoid mb-6">
          <h2 className="text-2xl font-semibold mb-4">Table</h2>
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.invoice}>
                  <TableCell className="font-medium">{invoice.invoice}</TableCell>
                  <TableCell>{invoice.paymentStatus}</TableCell>
                  <TableCell>{invoice.paymentMethod}</TableCell>
                  <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right">$750.00</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </section>

        {/* Textarea */}
        <section className="break-inside-avoid mb-6">
          <h2 className="text-2xl font-semibold mb-4">Textarea</h2>
          <div className="grid w-full gap-1.5">
              <Label htmlFor="message">Your message</Label>
              <Textarea placeholder="Type your message here." id="message"/>
          </div>
           <div className="grid w-full gap-1.5 mt-4">
              <Label htmlFor="disabled-message">Disabled</Label>
              <Textarea placeholder="Disabled textarea" id="disabled-message" disabled/>
          </div>
        </section>

        {/* Calendar */}
        <section className="break-inside-avoid mb-6">
          <h2 className="text-2xl font-semibold mb-4">Calendar</h2>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border shadow"
          />
        </section>
      </div> { /* End of multi-column container */}
    </div>
  );
};

export default StyleGuider;
