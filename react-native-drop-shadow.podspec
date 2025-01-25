require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-drop-shadow"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.author       = 'Hoang Lam'
  s.homepage     = 'https://github.com/hoanglam10499/react-native-drop-shadow'
  s.license      = package["license"]
  s.platform     = :ios, "9.0"
  s.source       = { :git => "https://github.com/hoanglam10499/react-native-drop-shadow", :tag => "#{s.version}" }
  s.source_files  = "ios/**/*.{h,m}"
  s.dependency "React"
end