
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Image, Paintbrush } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const UserMenu: React.FC = () => {
  const { currentUser, signOut, updateProfile } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  const textColors = [
    '#000000', '#D946EF', '#F97316', '#0EA5E9', '#8B5CF6', 
    '#ea384c', '#33C3F0', '#ffffff', '#888888'
  ];

  if (!currentUser) return null;

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
      await updateProfile({ photoURL: URL.createObjectURL(file) });
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile picture:", error);
      toast({
        title: "Error",
        description: "Failed to update profile picture",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleColorChange = async (color: string) => {
    try {
      await updateProfile({ textColor: color });
      toast({
        title: "Success",
        description: "Profile text color updated successfully",
      });
    } catch (error) {
      console.error("Error updating text color:", error);
      toast({
        title: "Error",
        description: "Failed to update text color",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
          <Avatar>
            {currentUser.photoURL ? (
              <AvatarImage src={currentUser.photoURL} alt="User avatar" />
            ) : (
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel style={{ color: currentUser.textColor || 'inherit' }}>
          {currentUser.displayName || currentUser.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="cursor-pointer">
          <label className="flex items-center w-full cursor-pointer">
            <Image className="mr-2 h-4 w-4" />
            <span>Change Picture</span>
            <Input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleProfilePictureChange}
              disabled={isUploading}
            />
          </label>
        </DropdownMenuItem>
        
        <Popover>
          <PopoverTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
              <Paintbrush className="mr-2 h-4 w-4" />
              <span>Change Text Color</span>
            </DropdownMenuItem>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <div className="flex flex-wrap gap-2">
              {textColors.map((color) => (
                <div
                  key={color}
                  className="w-6 h-6 rounded cursor-pointer border hover:scale-110 transition-transform"
                  style={{ backgroundColor: color, borderColor: color === '#ffffff' ? '#000000' : color }}
                  onClick={() => handleColorChange(color)}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="text-red-500 cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
