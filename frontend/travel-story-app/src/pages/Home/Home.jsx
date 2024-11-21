import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import TravelStoryCard from "../../components/cards/TravelStoryCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import AddEditTravelStory from "./AddEditTravelStory";
import ViewTravelStory from "./ViewTravelStory";
const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);

  const [openAddAndEditModal, setOpenAddAndEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  });

  //get user info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // get all travel stories

  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get("/get-all-stories");
      if (response.data && response.data.stories) {
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.log("An unexpected error occured ", error);
    }
  };
  const handleEdit = async (data) => {
    setOpenAddAndEditModal({ isShown: true, type: "edit", data: data });
  };
  const deleteTravelStory = async (data) => {
    console.log("hioii");

    const storyId = data._id;
    try {
      const response = await axiosInstance.delete("/delete-story/" + storyId);
      if (response.data && !response.data.error) {
        toast.error("Story Deleted Successfully");
        setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
        getAllTravelStories();
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.", error);
    }
  };
  const handleViewStory = async (data) => {
    setOpenViewModal({ isShown: true, data });
    console.log("hii");
  };

  const updateIsFavuorite = async (storyData) => {
    console.log(storyData);

    const storyId = storyData._id;
    try {
      const response = await axiosInstance.put(
        "/update-is-favuorite/" + storyId,
        {
          isFavourite: !storyData.isFavourite,
        }
      );
      if (response.data && response.data.story) {
        toast.success("Story updated successfully!");
        getAllTravelStories();
      }
    } catch (error) {
      console.log("An unexpected error occured ", error);
    }
  };

  useEffect(() => {
    getAllTravelStories();
    getUserInfo();
  }, []);

  return (
    <div>
      <Navbar userInfo={userInfo} />
      <div className="container mx-auto py-10">
        <div className=" flex gap-7">
          <div className=" flex-1">
            {allStories.length > 0 ? (
              <div className=" grid grid-cols-2 gap-4">
                {allStories.map((item) => {
                  return (
                    <TravelStoryCard
                      key={item._id}
                      imgUrl={item.imageUrl}
                      title={item.title}
                      story={item.story}
                      date={item.visitedDate}
                      visitedLocation={item.visitedLocation}
                      isFavuorite={item.isFavourite}
                      onEdit={() => handleEdit(item)}
                      onClick={() => handleViewStory(item)}
                      onFavuoriteClick={() => updateIsFavuorite(item)}
                    />
                  );
                })}
              </div>
            ) : (
              <>Empty card here</>
            )}
          </div>
          <div className=" w-[320px]"></div>
        </div>
      </div>
      {/* Add and edit Travel story book */}
      <Modal
        isOpen={openAddAndEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <AddEditTravelStory
          type={openAddAndEditModal.type}
          storyInfo={openAddAndEditModal.data}
          onClose={() => {
            setOpenAddAndEditModal({ isShown: false, data: null, type: "add" });
          }}
          getAllTravelStories={getAllTravelStories}
        />
      </Modal>
      {/* View Travel story book */}
      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <ViewTravelStory
          storyInfo={openViewModal.data || null}
          onClose={() =>
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }))
          }
          onEditClick={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
            handleEdit(openViewModal.data || null);
          }}
          onDeleteClick={() => {
            deleteTravelStory(openViewModal.data || null);
          }}
        />
      </Modal>
      <button
        className=" w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed bottom-10 right-10"
        onClick={() => {
          setOpenAddAndEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className=" text-[32px] text-white" />
      </button>
      <ToastContainer />
    </div>
  );
};

export default Home;
