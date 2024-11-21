import React, { useState } from "react";
import { MdAdd, MdClose, MdDeleteOutline, MdUpdate } from "react-icons/md";
import DateSelector from "../../components/input/DateSelector";
import ImageSelector from "../../components/input/ImageSelector";
import TagInput from "../../components/input/TagInput";
import moment from "moment";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import uploadImage from "../../utils/uploadImage";
const AddEditTravelStory = ({
  storyInfo,
  type,
  onClose,
  getAllTravelStories,
}) => {
  const [title, setTitle] = useState(storyInfo?.title || "");
  const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || "");
  const [story, setStory] = useState(storyInfo?.story || "");
  const [visitedLocation, setVisitedLocation] = useState(
    storyInfo?.visitedLocation || []
  );
  const [visitedDate, setVisitedDate] = useState(
    storyInfo?.visitedDate || null
  );

  const updateTravelStory = async () => {
    try {
      let imageURL = "";

      let postData = {
        title,
        story,
        imageUrl: storyInfo?.imageUrl || "",
        visitedLocation,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      };
      if (typeof storyImg === "object") {
        //upload new image
        const imgUploadRes = await uploadImage(storyImg);
        imageURL = imgUploadRes.imageURL || "";

        postData = {
          ...postData,
          imageURL: imageURL,
        };
      }

      const response = await axiosInstance.put(
        "/edit-story/" + storyInfo._id,
        postData
      );

      if (response.data && response.data.story) {
        toast.success("Story Updated Successfully");
        // Refresh stories
        getAllTravelStories();
        // Close modal or form
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("Unexpected errror , Please try again!");
      }
    }
  };

  const addNewTravelStory = async () => {
    try {
      let imageURL = "";

      // Upload image if present
      if (storyImg) {
        const imgUploadRes = await uploadImage(storyImg);
        // Get image URL
        imageURL = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post("/add-travel-story", {
        title,
        story,
        imageUrl: imageURL || "",
        visitedLocation,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      });

      if (response.data && response.data.story) {
        toast.success("Story Added Successfully");
        // Refresh stories
        getAllTravelStories();
        // Close modal or form
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("Unexpected errror , Please try again!");
      }
    }
  };

  const handleAddOrUpdateClick = () => {
    console.log("Input data :", {
      title,
      story,
      storyImg,
      visitedDate,
      visitedLocation,
    });
    if (!title) {
      setError("Please enter the title");
      return;
    }
    if (!story) {
      setError("Please enter the story");
      return;
    }
    setError("");
    if (type === "edit") {
      updateTravelStory();
    } else {
      addNewTravelStory();
    }
  };
  const [error, setError] = useState("");
  //delete story image and update in the story
  const handleDeleteImage = async () => {};
  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <h5 className="text-xl font-medium text-slate-700">
          {type === "add" ? "Add Story" : "Update Story"}
        </h5>

        <div>
          <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
            {type === "add" ? (
              <button className="btn-small" onClick={handleAddOrUpdateClick}>
                <MdAdd className="text-lg" /> ADD STORY
              </button>
            ) : (
              <>
                <button className="btn-small" onClick={handleAddOrUpdateClick}>
                  <MdUpdate className="text-lg" /> UPDATE STORY
                </button>
                <button className="btn-small btn-delete" onClick={onClose}>
                  <MdDeleteOutline className="text-lg" /> DELETE
                </button>
              </>
            )}

            <button className="" onClick={onClose}>
              <MdClose className="text-xl text-slate-400" />
            </button>
          </div>
          {error && (
            <p className=" text-red-500 text-xs pt-2 text-right">{error}</p>
          )}
        </div>
      </div>
      <div>
        <div className=" flex-1 flex flex-col gap-2 pt-4">
          <label className="input-label">TITLE</label>
          <input
            type="text"
            className=" text-2xl text-slate-950 outline-none"
            placeholder="A Day at the great wall"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className=" my-3">
            <DateSelector date={visitedDate} setDate={setVisitedDate} />
          </div>
          <ImageSelector
            image={storyImg}
            setImage={setStoryImg}
            handleDeleteImage={handleDeleteImage}
          />
          <div className=" flex flex-col gap-2 mt-4">
            <label className="input-story">STORY</label>
            <textarea
              type="text"
              className=" text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
              placeholder="Your story"
              rows={10}
              value={story}
              onChange={(e) => setStory(e.target.value)}
            />
          </div>
          <div className=" pt-3">
            <label className="input-label">VISITED LOCATIONS</label>
            <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditTravelStory;
