// import { ArrowRightIcon, StickerIcon } from "lucide-react";

// import { useNodes } from "./model/nodes";
// import { useCanvasRect } from "./hooks/use-canvas-rect";
// import { useLayoutFocus } from "./hooks/use-layout-focus";
// import { useViewModel } from "./view-model/use-view-model";
// import { useWindowEvents } from "./hooks/use-window-events";
// import { SelectionWindow } from "./ui/selection-window";
// import { Overlay } from "./ui/overlay";
// import { Layout } from "./ui/layout";
// import { Dots } from "./ui/dots";
// import { Canvas } from "./ui/canvas";
// import { Sticker } from "./ui/nodes/sticker";
// import { Actions } from "./ui/actions";
// import { ActionButton } from "./ui/action-button";
// import { useNodesDimensions } from "./hooks/use-nodes-dimensions";
// import { useWindowPositionModel } from "./model/windowPosition";
// import { Arrow } from "./ui/nodes/arrow";

// function BoardPage() {
//   const nodesModel = useNodes();
//   const windowPositionModel = useWindowPositionModel();
//   const focusLayoutRef = useLayoutFocus();
//   const { canvasRef, canvasRect } = useCanvasRect();
//   const { nodeRef, nodesDimensions } = useNodesDimensions();

//   const viewModel = useViewModel({
//     nodesModel,
//     canvasRect,
//     nodesDimensions,
//     windowPositionModel,
//   });

//   useWindowEvents(viewModel);

//   const windowPosition =
//     viewModel.windowPosition ?? windowPositionModel.position;

//   return (
//     <Layout ref={focusLayoutRef} onKeyDown={viewModel.layout?.onKeyDown}>
//       <Dots windowPosition={windowPosition} />

//       <Canvas
//         ref={canvasRef}
//         overlay={
//           <Overlay
//             onClick={viewModel.overlay?.onClick}
//             onMouseDown={viewModel.overlay?.onMouseDown}
//             onMouseUp={viewModel.overlay?.onMouseUp}
//           />
//         }
//         onClick={viewModel.canvas?.onClick}
//         windowPosition={windowPosition}
//       >
//         {viewModel.nodes.map((node) => {
//           if (node.type === "sticker") {
//             return <Sticker key={node.id} {...node} ref={nodeRef} />;
//           }
//           if (node.type === "arrow") {
//             return <Arrow key={node.id} {...node} ref={nodeRef} />;
//           }
//         })}
//         {viewModel.selectionWindow && (
//           <SelectionWindow {...viewModel.selectionWindow} />
//         )}
//       </Canvas>

//       <Actions>
//         <ActionButton
//           isActive={viewModel.actions?.addSticker?.isActive}
//           onClick={viewModel.actions?.addSticker?.onClick}
//         >
//           <StickerIcon />
//         </ActionButton>
//         <ActionButton
//           isActive={viewModel.actions?.addArrow?.isActive}
//           onClick={viewModel.actions?.addArrow?.onClick}
//         >
//           <ArrowRightIcon />
//         </ActionButton>
//       </Actions>
//     </Layout>
//   );
// }

// export const Component = BoardPage;
