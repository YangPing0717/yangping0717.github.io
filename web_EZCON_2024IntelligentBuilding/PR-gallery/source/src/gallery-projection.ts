import * as THREE from 'three'
import type { OrbitSlot } from './orbit-layout'
import type { MotionPose } from './gallery-motion'

export const GALLERY_DISTANCE = 46
export const GALLERY_FOV = 46
const halfFovTangent = Math.tan(THREE.MathUtils.degToRad(GALLERY_FOV / 2))

export function getCardGeometry(slot: OrbitSlot, width: number, height: number) {
  const span = 2 * halfFovTangent * (GALLERY_DISTANCE - slot.depth)
  return {
    position: new THREE.Vector3((slot.x - .5) * span * width / height, (.5 - slot.y) * span, slot.depth),
    distanceFactor: 400 * span / height * slot.scale,
  }
}

// Both renderers use this camera. The compatibility renderer projects each card
// separately, preserving depth and hit testing without a flattened CSS plane.
export function setGalleryCamera(camera: THREE.Camera, pose: MotionPose) {
  // Keep dolly movement within the card volume's safe camera range. Beyond it,
  // lens zoom lets cards fill and pass the viewport without crossing the camera.
  const physicalDistance = THREE.MathUtils.clamp(pose.distance, 34, 64)
  const lensZoom = physicalDistance / pose.distance
  if (camera instanceof THREE.PerspectiveCamera && camera.zoom !== lensZoom) {
    camera.zoom = lensZoom
    camera.updateProjectionMatrix()
  }
  const horizontal = Math.cos(pose.pitch) * physicalDistance
  camera.position.set(
    Math.sin(pose.yaw) * horizontal + pose.panX,
    Math.sin(pose.pitch) * physicalDistance + pose.panY,
    Math.cos(pose.yaw) * horizontal,
  )
  camera.lookAt(pose.panX, pose.panY, 0)
  camera.updateMatrixWorld()
}

export function projectCard(position: THREE.Vector3, slot: OrbitSlot, camera: THREE.PerspectiveCamera, width: number, height: number, viewPoint: THREE.Vector3, screenPoint: THREE.Vector3) {
  viewPoint.copy(position).applyMatrix4(camera.matrixWorldInverse)
  screenPoint.copy(position).project(camera)
  const depth = Math.max(1, -viewPoint.z)
  return {
    x: (screenPoint.x + 1) * width / 2,
    y: (1 - screenPoint.y) * height / 2,
    scale: slot.scale * (GALLERY_DISTANCE - slot.depth) / depth * camera.zoom,
    depth,
  }
}
