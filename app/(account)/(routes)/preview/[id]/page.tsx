import React from "react";

const PreviewPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  return (
    <div className="flex justify-around flex-1">
      <div>Preview</div>
      <div>AI</div>
    </div>
  );
};

export default PreviewPage;
