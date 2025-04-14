const baseColor = 0x1a59;
const backgroundColor = 0x0d2324;
const vantaOptions = [
{
  el: "#vanta1",
  yOffset: 0.5,
  size: 2,
  amplitudeFactor: 1.5 },

{
  el: "#vanta2",
  xOffset: -0.4,
  yOffset: -0.2 },

{
  el: "#vanta3",
  xOffset: 0.5,
  yOffset: -0.2,
  size: 1.8,
  amplitudeFactor: 2 }];



vantaOptions.map(options => {
  return VANTA.HALO({
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    baseColor: baseColor,
    backgroundColor: backgroundColor,
    // size: 0.8,
    ...options });

});