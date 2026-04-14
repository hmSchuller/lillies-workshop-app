require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "RNDatePickerFabric"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = "https://reactnative.dev"
  s.license      = "MIT"
  s.authors      = "Workshop"
  s.platforms    = { :ios => "15.0" }
  s.source       = { :path => "." }
  s.source_files = "ios/**/*.{h,m,mm,swift}"
  # Hide the Fabric view header from the Swift-visible umbrella.
  # RCTViewComponentView.h (pulled in transitively) contains C++ Fabric renderer
  # headers that the Swift compiler cannot handle. ObjC++ files in the pod still
  # access it via the regular relative #import path.
  s.private_header_files = "ios/RNDatePickerFabricView.h"

  s.pod_target_xcconfig = {
    # Standard C++20 for React Native Fabric headers.
    "CLANG_CXX_LANGUAGE_STANDARD" => "c++20",
    "HEADER_SEARCH_PATHS" => "\"$(PODS_ROOT)/Headers/Public/React-Codegen/react/renderer/components/RNDatePickerExerciseSpec\""
  }

  install_modules_dependencies(s)
end
