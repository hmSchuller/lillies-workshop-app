require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'lillie-shaker'
  s.version        = package['version']
  s.summary        = 'A shake detector Expo Module for lillies-app (workshop exercise)'
  s.description    = 'A shake detector Expo Module for lillies-app (workshop exercise)'
  s.license        = 'MIT'
  s.author         = 'Workshop'
  s.homepage       = 'https://github.com/placeholder'
  s.platforms      = { :ios => '15.1' }
  s.swift_version  = '5.4'
  s.source         = { :git => '' }
  s.static_framework = true
  s.dependency 'ExpoModulesCore'
  s.pod_target_xcconfig = { 'DEFINES_MODULE' => 'YES' }
  s.source_files = "*.{h,m,mm,swift,cpp}"
end
