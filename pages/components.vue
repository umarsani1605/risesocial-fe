<script setup>
import AppSidebar from '@/components/AppSidebar.vue';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset class="overflow-hidden">
      <ScrollArea class="h-[calc(100vh-4rem)]">
        <div class="flex flex-1 flex-col gap-8 p-8">
          <!-- Accordion -->
          <Card id="accordion">
            <CardHeader>
              <CardTitle>Accordion</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="max-w-xl">
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Is it accessible?</AccordionTrigger>
                    <AccordionContent> Yes. It adheres to the WAI-ARIA design pattern. </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Is it unstyled?</AccordionTrigger>
                    <AccordionContent> Yes. It's unstyled by default, giving you freedom to style it as needed. </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Can it be animated?</AccordionTrigger>
                    <AccordionContent> Yes. It can be animated using CSS transitions. </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </CardContent>
          </Card>

          <!-- Alert -->
          <Card>
            <CardHeader>
              <CardTitle>Alert</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="max-w-xl">
                <Alert>
                  <AlertTitle>Heads up!</AlertTitle>
                  <AlertDescription> You can add components to your app using the cli. </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          <!-- Alert Dialog -->
          <Card id="alert-dialog">
            <CardHeader>
              <CardTitle>Alert Dialog</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="max-w-xl">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete Account</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription> This action cannot be undone. </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>

          <!-- Aspect Ratio -->
          <Card id="aspect-ratio">
            <CardHeader>
              <CardTitle>Aspect Ratio</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="max-w-xl">
                <AspectRatio :ratio="16 / 9" class="bg-muted overflow-hidden rounded-md">
                  <img src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80" alt="Photo" class="object-cover" />
                </AspectRatio>
              </div>
            </CardContent>
          </Card>

          <!-- Avatar -->
          <Card id="avatar">
            <CardHeader>
              <CardTitle>Avatar</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="max-w-xl">
                <div class="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Badge -->
          <Card id="badge">
            <CardHeader>
              <CardTitle>Badge</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="max-w-xl">
                <div class="flex items-center space-x-4">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="info">Info</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Breadcrumb -->
          <Card id="breadcrumb">
            <CardHeader>
              <CardTitle>Breadcrumb</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="max-w-xl">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Components</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </CardContent>
          </Card>

          <!-- Button -->
          <Card id="button">
            <CardHeader>
              <CardTitle>Button</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="max-w-xl">
                <div class="flex items-center space-x-4">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="success">Success</Button>
                  <Button variant="info">Info</Button>
                  <Button variant="warning">Warning</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Calendar -->
          <Card id="calendar">
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="max-w-xl">
                <Calendar />
              </div>
            </CardContent>
          </Card>

          <!-- Card -->
          <Card id="card">
            <CardHeader>
              <CardTitle>Card</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="max-w-xl">
                <Card>
                  <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Card Content</p>
                  </CardContent>
                  <CardFooter>
                    <p>Card Footer</p>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>

          <!-- Checkbox -->
          <Card id="checkbox">
            <CardHeader>
              <CardTitle>Checkbox</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="max-w-xl">
                <div class="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <label htmlFor="terms">Accept terms and conditions</label>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Command -->
          <Card id="command">
            <CardHeader>
              <CardTitle>Command</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="max-w-xl">
                <Command>
                  <CommandInput placeholder="Type a command or search..." />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                      <CommandItem>Calendar</CommandItem>
                      <CommandItem>Search</CommandItem>
                      <CommandItem>Settings</CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </div>
            </CardContent>
          </Card>

          <!-- Dialog -->
          <Card id="dialog">
            <CardHeader>
              <CardTitle>Dialog</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="max-w-xl">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Open Dialog</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Dialog Title</DialogTitle>
                      <DialogDescription>Dialog Description</DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          <!-- Dropdown Menu -->
          <Card id="dropdown-menu">
            <CardHeader>
              <CardTitle>Dropdown Menu</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="max-w-xl">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button>Open Menu</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>

          <!-- Input -->
          <Card id="input">
            <CardHeader>
              <CardTitle>Input</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="max-w-xl">
                <Input placeholder="Enter text..." />
              </div>
            </CardContent>
          </Card>

          <!-- Navigation Menu -->
          <Card id="navigation-menu">
            <CardHeader>
              <CardTitle>Navigation Menu</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="max-w-xl">
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <NavigationMenuLink>Link</NavigationMenuLink>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            </CardContent>
          </Card>

          <!-- Popover -->
          <Card id="popover">
            <CardHeader>
              <CardTitle>Popover</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="max-w-xl">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">Open Popover</Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <p>Popover content</p>
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>

          <!-- Select -->
          <Card id="select">
            <CardHeader>
              <CardTitle>Select</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="max-w-xl">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Option 1</SelectItem>
                    <SelectItem value="2">Option 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <!-- Slider -->
          <Card id="slider">
            <CardHeader>
              <CardTitle>Slider</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="max-w-xl">
                <Slider defaultValue="{[50]}" max="{100}" step="{1}" class="w-[200px]" />
              </div>
            </CardContent>
          </Card>

          <!-- Table -->
          <Card id="table">
            <CardHeader>
              <CardTitle>Table</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="max-w-xl">
                <Table>
                  <TableCaption>A list of your recent invoices.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>#001</TableCell>
                      <TableCell>Paid</TableCell>
                      <TableCell>$250.00</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <!-- Tabs -->
          <Card id="tabs">
            <CardHeader>
              <CardTitle>Tabs</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="max-w-xl">
                <Tabs defaultValue="account">
                  <TabsList>
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                  </TabsList>
                  <TabsContent value="account">Account settings</TabsContent>
                  <TabsContent value="password">Password settings</TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>

          <!-- Textarea -->
          <Card id="textarea">
            <CardHeader>
              <CardTitle>Textarea</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="max-w-xl">
                <Textarea placeholder="Type your message..." />
              </div>
            </CardContent>
          </Card>

          <!-- Toggle -->
          <Card id="toggle">
            <CardHeader>
              <CardTitle>Toggle</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="max-w-xl">
                <Toggle>Toggle</Toggle>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </SidebarInset>
  </SidebarProvider>
</template>
