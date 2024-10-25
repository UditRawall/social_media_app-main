import { Models } from "appwrite";

// import { useToast } from "@/components/ui/use-toast";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import { Loader, PostCard, UserCard } from "@/components/shared";
import { useGetRecentPosts, useGetUsers, useSignOutAccount } from "@/lib/react-query/queries";
import { Button } from "@/components/ui";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { INITIAL_USER, useUserContext } from "@/context/AuthContext";

const Home = () => {
  // const { toast } = useToast();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { user ,setUser, setIsAuthenticated } = useUserContext();

  const { mutate: signOut } = useSignOutAccount();

  console.log(user);

  useEffect(() => {
    setIsDrawerOpen(!(user && user.id));
  }, [user]);

  const { isAuthenticated } = useUserContext();
  console.log(isAuthenticated);

  const {
    data: posts,
    isLoading: isPostLoading,
    isError: isErrorPosts,
  } = useGetRecentPosts();
  const {
    data: creators,
    isLoading: isUserLoading,
    isError: isErrorCreators,
  } = useGetUsers(10);

  if (isErrorPosts || isErrorCreators) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
        <div className="home-creators">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
      </div>
    );
  }

  const handleSignIn = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    signOut();
    setIsAuthenticated(false);
    setUser(INITIAL_USER);
    navigate("/sign-in");
  };

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full ">
              {posts?.documents.map((post: Models.Document) => (
                <li key={post.$id} className="flex justify-center w-full">
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="home-creators">
        <h3 className="h3-bold text-light-1">Top Creators</h3>
        {isUserLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {creators?.documents.map((creator) => (
              <li key={creator?.$id}>
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* DRAWER WINDOW  */}
      {
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        {/* No need for DrawerTrigger since the drawer opens automatically */}
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              Connect, Share, and Explore - Join Us Today!
            </DrawerTitle>
            <DrawerDescription>
              Log in to see photos and videos from friends and discover other
              accounts you'll love.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button onClick={handleSignIn} className="bg-primary-500 hover:bg-primary-600 w-[50%] m-auto">Sign in</Button>
            <DrawerClose>
              <Button variant="outline" onClick={() => setIsDrawerOpen(false)} className="bg-transparent hover:bg-white hover:text-black w-[50%] m-auto">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>}
    </div>
  );
};

export default Home;
