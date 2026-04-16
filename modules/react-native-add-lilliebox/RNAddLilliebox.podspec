# Platform interop glue (iOS).
# CocoaPods spec that collects all iOS sources and calls install_modules_dependencies
# to wire up React Native New Architecture / codegen support.
require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "RNAddLilliebox"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = "https://reactnative.dev"
  s.license      = "MIT"
  s.authors      = "Workshop"
  s.platforms    = { :ios => "16.0" }
  s.source       = { :path => "." }
  s.source_files = "ios/**/*.{h,m,mm,swift}"

  install_modules_dependencies(s)
end
